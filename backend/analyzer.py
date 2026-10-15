import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()
MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-terra")


def summarize_pdf(pdf_path: str) -> str:
    # 1. Subir el PDF a OpenAI
    with open(pdf_path, "rb") as pdf:
        uploaded_file = client.files.create(
            file=pdf,
            purpose="user_data",
        )

    # 2. Solicitar el análisis
    response = client.responses.create(
        model=MODEL,
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": uploaded_file.id,
                    },
                    {
                        "type": "input_text",
                        "text": (
                            "Analiza el documento y devuelve un resumen "
                            "en español con estas secciones:\n"
                            "1. Resumen ejecutivo\n"
                            "2. Ideas principales\n"
                            "3. Hallazgos relevantes\n"
                            "4. Conclusiones\n"
                            "Distingue los hechos de tus inferencias.\n"
                            "IMPORTANTE: El resumen completo debe tener máximo 200 palabras en total."
                        ),
                    },
                ],
            }
        ],
    )

    return response.output_text
