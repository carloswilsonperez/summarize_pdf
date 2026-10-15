import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  // Parse the summary into sections
  const sections = summary.split(/\n(?=\d\.)/).map((section) => {
    const [title, ...content] = section.split('\n');
    return {
      title: title.replace(/^\d\.\s*/, ''),
      content: content.join('\n').trim(),
    };
  });

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h5" component="div">
            Resumen del Documento
          </Typography>
        </Box>

        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Chip
              label={section.title}
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography
              variant="body1"
              paragraph
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
            >
              {section.content}
            </Typography>
            {index < sections.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
