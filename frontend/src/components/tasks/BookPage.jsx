import * as React from 'react';
import Box from '@mui/material/Box';

export default function BookPage({children}) {
  return (
    <Box sx={{
          width: "50%",
          height: 600,
          borderRadius: 15,
          bgcolor: "tan",
          p: 6,
          display: 'flex',
          justifyContent: 'center',
        }}> 
        {children}</Box>
  );
}