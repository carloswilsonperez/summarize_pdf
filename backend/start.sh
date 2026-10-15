#!/bin/bash

# Script para iniciar el backend con uv

cd "$(dirname "$0")"

# Activar el virtual environment de uv
source .venv/bin/activate

# Iniciar el servidor
uvicorn main:app --reload
