import * as React from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Typography } from '@mui/material';



export default function NewTask() {
  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
     <Accordion defaultExpanded>
        <AccordionSummary
          // expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <Typography component="span">Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          Body text
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}