import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { lazy, Suspense, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as THREE from "three";
import EmptyRoom from "../models/EmptyRoom";
import {
  fetchRoom,
  updateRoom,
  updateDecorationPosition,
} from "../features/roomSlice";

// Dynamically imports a furniture component by model name and loads it lazily.
const loadFurniture = (model) =>
  lazy(() =>
    import(`../models/furniture/${model}.jsx`).catch(
      () => import("../models/furniture/Error.jsx")
    )
  );

function MovableFurniture({ item, index, isSelected, onSelect }) {
  const groupRef = useRef();
  const dispatch = useDispatch();
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const plane = useRef(
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -item.position[1])
  );

  // Handle object dragging on mouse move
  useEffect(() => {
    if (!isSelected) return;

    const handleMouseMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const intersectPoint = new THREE.Vector3();
      if (raycaster.current.ray.intersectPlane(plane.current, intersectPoint)) {
        if (groupRef.current) {
          groupRef.current.position.set(
            intersectPoint.x,
            item.position[1],
            intersectPoint.z
          );
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isSelected, camera, gl.domElement, item.position]);

  // When deselected, commit the final position to Redux
  useEffect(() => {
    if (!isSelected && groupRef.current) {
      const finalPos = groupRef.current.position.toArray();
      dispatch(updateDecorationPosition({ index, position: finalPos }));
    }
  }, [isSelected, index, dispatch]);

  const DynamicFurniture = loadFurniture(item.model);

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      style={{ cursor: isSelected ? "grabbing" : "pointer" }}
    >
      <Suspense fallback={null}>
        <DynamicFurniture />
      </Suspense>
    </group>
  );
}

export default function RoomScene({ isEditable }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRoom());
  }, [dispatch]);

  const adjustForScreenSize = () => {
    const isSmallScreen = window.innerWidth < 800;
    return {
      scale: isSmallScreen ? [0.9, 0.9, 0.9] : [30, 30, 30],
      position: [0, -15, 0],
    };
  };

  const { scale: roomScale, position: roomPosition } = adjustForScreenSize();

  const furnitureList = useSelector((state) => state.room.decorations);
  const [selectedDecor, setSelectedDecor] = useState(null);

  const handleObjectSelection = (index) => {
    if (!isEditable) return;
    setSelectedDecor((prev) => (prev === index ? null : index));
  };

  const handleEditRoom = () => {
    dispatch(updateRoom({ decorations: furnitureList }));
  };

  return (
    <>
      <Canvas camera={{ position: [-60, 48, 60], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <directionalLight
          color="#fff5b6"
          position={[-60, 48, 60]}
          intensity={1.5}
          castShadow
        />
        <EmptyRoom scale={roomScale} position={roomPosition} />

        <group position={[0, -12, 0]}>
          {furnitureList.map(
            (item, index) =>
              item.placed && (
                <MovableFurniture
                  key={index}
                  item={item}
                  index={index}
                  isSelected={selectedDecor === index}
                  onSelect={handleObjectSelection}
                />
              )
          )}
        </group>

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

      {isEditable && (
        <button
          onClick={handleEditRoom}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            zIndex: 100,
          }}
        >
          Save Changes
        </button>
      )}
    </>
  );
}
