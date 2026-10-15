import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const PdfUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'grey.300',
          bgcolor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <label htmlFor="pdf-upload">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <UploadIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Arrastra y suelta tu PDF aquí
            </Typography>
            <Typography variant="body2" color="text.secondary">
              o haz clic para seleccionar un archivo
            </Typography>
            <Button
              variant="contained"
              component="span"
              size="large"
            >
              Seleccionar PDF
            </Button>
          </Box>
        </label>
      </Paper>
    </Box>
  );
};

export default PdfUploader;
