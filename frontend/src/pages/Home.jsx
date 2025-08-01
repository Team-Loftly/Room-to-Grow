import HUD from "../components/home/HUD";
import Room from "../components/Room.jsx";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import "../styling/Home.css";

export default function Home() {
  return (
    <Box // Parent box
      sx={{
        boxSizing: "border-box",
        height: "90vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box // Contains room relative to parent
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Room isEditable={false} />
      </Box>
      <Box // Contains HUD relative to parent
        sx={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <HUD />
      </Box>
    </Box>
  );
}
