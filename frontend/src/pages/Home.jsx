import HUD from "../components/home/HUD";
import TimerPopup from "../components/home/timerPopup";
import Room from "../components/Room.jsx";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import "../styling/Home.css";

export default function Home() {
  const showTimer = useSelector((state) => state.timer.showTimer);
  return (
    <Stack
      direction="row"
      sx={{
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      <HUD />
      {showTimer && <TimerPopup open={showTimer} />}
      <Room isEditable={false} />
    </Stack>
  );
}
