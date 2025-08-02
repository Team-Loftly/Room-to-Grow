// BaseRoom.jsx

import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import baseRoomScene from "../assets/3d/basicRoom.glb";
import { MeshStandardMaterial } from "three";

// Materials for room
const walls = new MeshStandardMaterial({
  color: "#dedbd7",
  roughness: 0.9,
  metalness: 0,
});
const underside = new MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.9,
  metalness: 0,
});
const floor = new MeshStandardMaterial({
  color: "#997e68",
  roughness: 0.9,
  metalness: 0,
});

const BaseRoom = (props) => {
  const roomRef = useRef();
  const { nodes, materials } = useGLTF(baseRoomScene);
  const [timeOfDay, setTimeOfDay] = useState("day");

  // Function to determine time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 20) {
      return "day";
    } else {
      return "night";
    }
  };

  // Function to get window colors based on time of day
  const getWindowConfig = (timeOfDay) => {
    switch (timeOfDay) {
      case "day":
        return {
          color: 0xfdfbd3, // Warm daylight
          intensity: 2.5, // Bright
          opacity: 0.8,
        };
      case "night":
        return {
          color: 0x1a1a2e, // Dark blue night
          intensity: 0.3, // Very dim
          opacity: 0.95,
        };
      default:
        return {
          color: 0xfdfbd3,
          intensity: 2.5,
          opacity: 0.8,
        };
    }
  };

  // Update time of day periodically
  useEffect(() => {
    const updateTimeOfDay = () => {
      const currentTime = getTimeOfDay();
      setTimeOfDay(currentTime);
    };

    // Update immediately
    updateTimeOfDay();

    // Update every minute
    const interval = setInterval(updateTimeOfDay, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update window material when time of day changes
  useEffect(() => {
    if (materials.Glow) {
      const config = getWindowConfig(timeOfDay);

      materials.Glow.emissive = new THREE.Color(config.color);
      materials.Glow.emissiveIntensity = config.intensity;
      materials.Glow.opacity = config.opacity;
      materials.Glow.transparent = true;

      // Add a subtle color tint to the base color as well
      materials.Glow.color = new THREE.Color(config.color);

      console.log(`Window updated for ${timeOfDay} time`);
    }
  }, [materials.Glow, timeOfDay]);

  return (
    <group {...props} ref={roomRef}>
      <group position={[0, 0, 0]}>
        <mesh
          // Window frame
          receiveShadow
          geometry={nodes.Frame.geometry}
          material={materials["Wood.001"]}
          position={[0.006, 0.469, -0.897]}
          rotation={[-1.642, 1.559, -1.493]}
          scale={[-0.023, -0.213, -0.384]}
        />
        <mesh
          // Window glass - now dynamic based on time
          receiveShadow
          geometry={nodes.Glass.geometry}
          material={materials.Glow}
          position={[0.006, 0.469, -0.877]}
          rotation={[-1.654, 1.559, -1.493]}
          scale={[-0.023, -0.213, -0.384]}
        />
        <mesh
          // Room floor
          receiveShadow
          geometry={nodes.Cube003.geometry}
          material={floor}
        />
        <mesh
          // Room underside of floor
          receiveShadow
          geometry={nodes.Cube003_1.geometry}
          material={underside}
        />
        <mesh
          // Room walls
          receiveShadow
          geometry={nodes.Cube003_2.geometry}
          material={walls}
        />
      </group>
    </group>
  );
};

export default BaseRoom;
