import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <Box
        sx={{
          flexGrow: 1,
          // Base colour of the background
          bgcolor: "#050c26",
          // Background gradient where 0% 0% is the top left and 100% 100% is the bottom right
          backgroundImage:
            "radial-gradient(at 0% 0%, #427d49 50px, transparent 70%), " +
            "radial-gradient(at 100% 0%, #368399 50px, transparent 70%), " +
            "radial-gradient(at 0% 100%, #001121 50px, transparent 70%), " +
            "radial-gradient(at 100% 100%, #032407 50px, transparent 70%), " +
            "radial-gradient(at 50% 50%, #050c26 50px, transparent 70%)",
          backgroundSize: "100%",
          height: "90%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
