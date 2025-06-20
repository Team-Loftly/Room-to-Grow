import { useSelector, useDispatch } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import HUD from "../components/home/HUD";
import TimerPopup from "../components/home/timerPopup";
import EmptyRoom from "../models/EmptyRoom";
import DeskChair1 from "../models/furniture/DeskChair1";
("../models/furniture/DeskChair1");
import { Box } from "@mui/material";
import "../css/Home.css";

export default function Home() {
  const dispatch = useDispatch();
  const showTimer = useSelector((state) => state.timer.showTimer);
  const furniture = useSelector((state) => state.room.furniture);

  const adjustForScreenSize = () => {
    const isSmallScreen = window.innerWidth < 800;
    return {
      scale: isSmallScreen ? [0.9, 0.9, 0.9] : [30, 30, 30],
      position: [0, -15, 0],
    };
  };

  const { scale: roomScale, position: roomPosition } = adjustForScreenSize();

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

      <Canvas camera={{ position: [-60, 48, 60], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={3} />
        <EmptyRoom scale={roomScale} position={roomPosition} />
        {Object.entries(furniture).map(([key, item], index) => (
          <DeskChair1 // Need to figure out how to dynamically import and load models based on key
            key={index}
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
          />
        ))}
        <OrbitControls
          target={[0, 0, 0]}
          minDistance={15}
          maxDistance={150}
          makeDefault
          enablePan={false}
          enableZoom
          enableRotate
        />
      </Canvas>
    </Box>
  );
}
