import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        height: "100vh",
        display: "flex",
        boxSizing: "border-box",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#1E2939",
          height: "90%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
