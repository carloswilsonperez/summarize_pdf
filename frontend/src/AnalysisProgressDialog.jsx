import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  LinearProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Circle, Pending } from '@mui/icons-material';

const stages = [
  { key: 'uploading', label: 'Cargando PDF' },
  { key: 'validating', label: 'Validando documento' },
  { key: 'analyzing', label: 'Analizando documento con Terra…' },
  { key: 'completed', label: 'Preparando resultado' },
];

const AnalysisProgressDialog = ({ open, status, currentStage, uploadProgress }) => {
  const getStageIcon = (stageKey) => {
    const currentIndex = stages.findIndex((s) => s.key === status);
    const stageIndex = stages.findIndex((s) => s.key === stageKey);

    if (stageIndex < currentIndex) {
      return <CheckCircle color="success" />;
    } else if (stageIndex === currentIndex) {
      return <Pending color="primary" />;
    } else {
      return <Circle color="disabled" />;
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Análisis de Documento</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Procesando tu documento PDF...
        </DialogContentText>

        {status === 'uploading' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Progreso de carga: {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <List>
          {stages.map((stage) => (
            <ListItem key={stage.key}>
              <ListItemIcon>{getStageIcon(stage.key)}</ListItemIcon>
              <ListItemText
                primary={stage.label}
                secondary={stage.key === status ? currentStage : ''}
              />
            </ListItem>
          ))}
        </List>

        {status === 'failed' && (
          <Box sx={{ mt: 2, color: 'error.main' }}>
            <Typography variant="body2">
              Error durante el procesamiento
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisProgressDialog;
