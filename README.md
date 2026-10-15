# PDF Document Analyzer

Una aplicación web para analizar y resumir documentos PDF utilizando OpenAI.

## Requisitos Previos

- **Python 3.13** (o compatible)
- **uv** - Gestor de paquetes Python rápido (opcional pero recomendado)
- **Node.js** y **npm** - Para el frontend
- **API Key de OpenAI** - Obténla en https://platform.openai.com

## Arquitectura

- **Frontend**: React + Material UI
- **Backend**: FastAPI (Python)
- **AI Model**: OpenAI (configurable: gpt-4o-mini recomendado para economía)

## Estructura del Proyecto

```
summarizepdf/
├── backend/
│   ├── main.py           # Endpoints de FastAPI y gestión de trabajos
│   ├── analyzer.py       # Integración con OpenAI Terra
│   ├── requirements.txt  # Dependencias de Python
│   ├── uploads/          # Archivos temporales (creado automáticamente)
│   └── .env.example      # Ejemplo de variables de entorno
└── frontend/
    ├── src/
    │   ├── App.jsx              # Componente principal
    │   ├── PdfUploader.jsx      # Componente de carga de PDF
    │   ├── AnalysisProgressDialog.jsx  # Modal de progreso
    │   ├── SummaryCard.jsx      # Card de resumen
    │   └── api.js               # Cliente HTTP para FastAPI
    └── package.json
```

## Configuración

### Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Crea un entorno virtual con uv (requiere uv instalado):
```bash
uv venv --python 3.13
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
```

3. Instala las dependencias con uv:
```bash
uv pip install -r requirements.txt
```

4. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y añade tu API key de OpenAI:
```
OPENAI_API_KEY=your_actual_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Modelos recomendados:
- `gpt-4o-mini` - Económico y buen rendimiento (recomendado)
- `gpt-4o` - Mejor rendimiento, más costoso
- `gpt-3.5-turbo` - El más económico, menos capacidad

5. Inicia el servidor:
```bash
uvicorn main:app --reload
```

O usa el script de inicio:
```bash
./start.sh
```

El backend estará disponible en `http://localhost:8000`

### Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

O usa el script de inicio:
```bash
./start.sh
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

## Arranque Rápido

Para iniciar ambos servicios al mismo tiempo (en terminales separadas):

**Terminal 1 (Backend):**
```bash
cd backend
./start.sh
```

**Terminal 2 (Frontend):**
```bash
cd frontend
./start.sh
```

### Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

## Uso

1. Abre el navegador en `http://localhost:5173`
2. Arrastra y suelta un archivo PDF o haz clic para seleccionar uno
3. El modal de progreso mostrará las etapas del proceso:
   - Cargando PDF (con porcentaje real)
   - Validando documento
   - Analizando documento con el modelo de OpenAI…
   - Preparando resultado
4. Una vez completado, verás el resumen estructurado con:
   - Resumen ejecutivo
   - Ideas principales
   - Hallazgos relevantes
   - Conclusiones

## API Endpoints

### POST /documents
Sube un documento PDF para análisis.
- Body: `multipart/form-data` con el campo `file`
- Response: `{"job_id": "uuid"}`

### GET /jobs/{job_id}
Obtiene el estado de un trabajo de análisis.
- Response: 
```json
{
  "job_id": "uuid",
  "status": "pending|validating|analyzing|completed|failed",
  "current_stage": "string",
  "result": "string|null",
  "error": "string|null",
  "created_at": "ISO8601 timestamp"
}
```

### DELETE /jobs/{job_id}
Elimina un trabajo (opcional).

## Notas

- Para producción, considera usar una cola de tareas (Celery, RQ) y almacenamiento persistente (Redis, PostgreSQL)
- El sistema actual usa almacenamiento en memoria para los trabajos
- Los archivos PDF se eliminan automáticamente después del procesamiento
- El polling del frontend se realiza cada 2 segundos
- El resumen está configurado para máximo 200 palabras (en `backend/analyzer.py`) para optimizar el consumo de tokens
- El costo por archivo depende del tamaño del PDF; con gpt-4o-mini y el límite de 200 palabras, es muy económico

## Mejoras Futuras

- Implementar Server-Sent Events o WebSockets para actualizaciones en tiempo real
- Añadir autenticación de usuarios
- Permitir múltiples documentos simultáneos
- Guardar historial de análisis
- Soportar otros formatos de documento
