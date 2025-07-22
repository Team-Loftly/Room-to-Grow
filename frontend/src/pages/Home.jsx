import HUD from "../components/home/HUD";
import Room from "../components/Room.jsx";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import "../styling/Home.css";

export default function Home() {
  return (
    <Stack
      direction="row"
      sx={{
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      <HUD />
      <Room isEditable={false} />
    </Stack>
  );
}
