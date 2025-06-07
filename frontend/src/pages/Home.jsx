import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import HUD from "../components/home/HUD";
import PlaceholderCafe from "../models/PlaceholderCafe";
import { Box } from "@mui/material";
import "../css/Home.css";

export default function Home() {
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
      <Canvas camera={{ position: [-60, 48, 60], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <PlaceholderCafe scale={roomScale} position={roomPosition} />
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
