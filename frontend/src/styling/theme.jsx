import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Be Vietnam Pro",
      "sans-serif", // Fallback to a generic sans-serif font
    ].join(","),
  },
});

export default theme;
