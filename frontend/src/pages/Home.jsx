import HUD from "../components/home/HUD";
import TimerPopup from "../components/home/timerPopup";
import Room from "../components/Room.jsx";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import "../css/Home.css";

export default function Home() {
  const showTimer = useSelector((state) => state.timer.showTimer);
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HUD />
      {showTimer && <TimerPopup open={showTimer} />}
      <Room isEditable={false} />
    </Box>
  );
}
