import os
import uuid
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import summarize_pdf

app = FastAPI(title="PDF Document Analyzer")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job storage (for prototype)
jobs = {}

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)


class JobStatus(BaseModel):
    job_id: str
    status: str  # "pending", "uploading", "validating", "analyzing", "completed", "failed"
    upload_progress: int = 0
    current_stage: str = ""
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime


def process_document(job_id: str, pdf_path: str):
    """Background task to process the PDF document"""
    try:
        # Update status to validating
        jobs[job_id].status = "validating"
        jobs[job_id].current_stage = "Validando documento"

        # Simulate validation (you can add real validation here)
        import time
        time.sleep(1)

        # Update status to analyzing
        jobs[job_id].status = "analyzing"
        jobs[job_id].current_stage = "Analizando documento con Terra…"

        # Call the analyzer
        summary = summarize_pdf(pdf_path)

        # Update status to completed
        jobs[job_id].status = "completed"
        jobs[job_id].current_stage = "Preparando resultado"
        jobs[job_id].result = summary

        # Clean up uploaded file
        os.remove(pdf_path)

    except Exception as e:
        jobs[job_id].status = "failed"
        jobs[job_id].error = str(e)
        jobs[job_id].current_stage = "Error durante el procesamiento"


@app.post("/documents")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Upload a PDF document and start analysis"""
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create job ID
    job_id = str(uuid.uuid4())
    
    # Save uploaded file
    pdf_path = f"uploads/{job_id}_{file.filename}"
    with open(pdf_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create job entry
    jobs[job_id] = JobStatus(
        job_id=job_id,
        status="pending",
        current_stage="PDF recibido",
        created_at=datetime.now()
    )
    
    # Start background processing
    background_tasks.add_task(process_document, job_id, pdf_path)
    
    return {"job_id": job_id}


@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a processing job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return {
        "job_id": job.job_id,
        "status": job.status,
        "current_stage": job.current_stage,
        "result": job.result,
        "error": job.error,
        "created_at": job.created_at.isoformat()
    }


@app.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a job and clean up resources"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    del jobs[job_id]
    return {"message": "Job deleted successfully"}


@app.get("/")
async def root():
    return {"message": "PDF Document Analyzer API"}
