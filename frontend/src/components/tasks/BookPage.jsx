import * as React from "react";
import Box from "@mui/material/Box";

export default function BookPage({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  );
}
