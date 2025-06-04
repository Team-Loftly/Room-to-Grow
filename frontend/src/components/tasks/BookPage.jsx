import * as React from 'react';
import Box from '@mui/material/Box';

export default function BookPage({children}) {
  return (
    <Box sx={{
          flex: 1,
          width: "50%",
          height: "100%",
          borderRadius: 15,
          bgcolor: "tan",
          p: 5,
          display: 'flex',
          justifyContent: 'center',
          boxSizing: "border-box"
        }}> 
        {children}</Box>
  );
}