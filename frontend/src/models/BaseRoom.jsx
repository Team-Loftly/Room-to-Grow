// BaseRoom.jsx

import { useRef, useEffect } from "react";
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

  // Re-run if material changes for window (unlikely for static models)
  useEffect(() => {
    if (materials.Glow) {
      materials.Glow.emissive = new THREE.Color(0xfdfbd3); // Glow color
      materials.Glow.emissiveIntensity = 2.5; // Glow intensity
    }
  }, [materials.Glow]);

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
          // Window glass
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
