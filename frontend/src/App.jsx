import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import PdfUploader from './PdfUploader';
import AnalysisProgressDialog from './AnalysisProgressDialog';
import SummaryCard from './SummaryCard';
import { uploadDocument, getJobStatus } from './api';

function App() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle');
  const [currentStage, setCurrentStage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollingInterval;

    if (jobId && status !== 'completed' && status !== 'failed') {
      pollingInterval = setInterval(async () => {
        try {
          const jobData = await getJobStatus(jobId);
          setStatus(jobData.status);
          setCurrentStage(jobData.current_stage);

          if (jobData.status === 'completed') {
            setSummary(jobData.result);
            clearInterval(pollingInterval);
          } else if (jobData.status === 'failed') {
            setError(jobData.error);
            clearInterval(pollingInterval);
          }
        } catch (err) {
          console.error('Error polling job status:', err);
          setError('Error checking job status');
          clearInterval(pollingInterval);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [jobId, status]);

  const handleFileSelect = async (file) => {
    try {
      setStatus('uploading');
      setUploadProgress(0);
      setError(null);
      setSummary(null);

      const data = await uploadDocument(file, (progress) => {
        setUploadProgress(progress);
      });

      setJobId(data.job_id);
      setStatus('pending');
      setCurrentStage('PDF recibido');
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file');
      setStatus('failed');
    }
  };

  const handleReset = () => {
    setJobId(null);
    setStatus('idle');
    setCurrentStage('');
    setUploadProgress(0);
    setSummary(null);
    setError(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <DescriptionIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            PDF Document Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Analizador de Documentos PDF
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          Sube un documento PDF para obtener un resumen estructurado con análisis de Terra
        </Typography>

        {status === 'idle' && <PdfUploader onFileSelect={handleFileSelect} />}

        {summary && (
          <>
            <SummaryCard summary={summary} />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Analizar otro documento
              </button>
            </Box>
          </>
        )}

        {error && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: 1 }}>
            <Typography variant="body1">{error}</Typography>
            <button
              onClick={handleReset}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#d32f2f',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Intentar de nuevo
            </button>
          </Box>
        )}

        <AnalysisProgressDialog
          open={status !== 'idle' && status !== 'completed' && status !== 'failed'}
          status={status}
          currentStage={currentStage}
          uploadProgress={uploadProgress}
        />
      </Container>
    </Box>
  );
}

export default App;
