import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as THREE from "three";
import EmptyRoom from "..//models/EmptyRoom";
import { fetchRoom, updateRoom } from "../features/roomSlice";
import Snackbar from "@mui/material/Snackbar";

// Dynamically imports a furniture component by model name and loads it lazily
const loadFurniture = (model) =>
  lazy(() =>
    import(`../models/furniture/${model}.jsx`).catch(
      () => import("../models/furniture/Error.jsx")
    )
  );

// Dict to hold index to position and rotation of each furniture item
let furnitureTransformations = {};

// MovableFurniture handles selection and transformation logic per item
function MovableFurniture({ item, index, isSelected, onSelect }) {
  const groupRef = useRef();
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  // Plane to move objects on (XZ plane with Y fixed)
  const plane = useRef(
    new THREE.Plane(new THREE.Vector3(0, 1, 0), -item.position[1])
  );

  // Handles position change
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
          // Move the group smoothly along X and Z, keep Y fixed
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

  // Handles rotation change
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (event) => {
      if (!groupRef.current) return;

      // Rotate around Y-axis in 11.25 degree increments
      const rotationStep = Math.PI / 16;
      if (event.key === "ArrowLeft") {
        groupRef.current.rotation.y += rotationStep;
      } else if (event.key === "ArrowRight") {
        groupRef.current.rotation.y -= rotationStep;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, camera, gl.domElement, item.rotation]);

  // Update new position and rotation in dict on deselect
  useEffect(() => {
    if (!isSelected && groupRef.current) {
      furnitureTransformations[index] = {
        position: groupRef.current.position.toArray(),
        rotation: groupRef.current.rotation.toArray().slice(0, 3),
      };
    }
  }, [isSelected, index]);

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

  // Fetch items on mount
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

  // Furniture list from redux state
  const furnitureList = useSelector((state) => state.room.decorations);

  // Track selected item index
  const [selectedDecor, setSelectedDecor] = useState(null);

  // Used in "Changes Saved" toast notification
  const [saved, setSaved] = useState(false);
  const handleClose = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setSaved(false);
  };

  // Toggle selection
  const handleObjectSelection = (index) => {
    if (!isEditable) return;
    if (selectedDecor === index) {
      setSelectedDecor(null); // Deselect on second click
    } else {
      setSelectedDecor(index);
    }
  };

  // Apply transformations from dict items to the corresponding furniture list items
  // and dispatch update to the backend
  const handleEditRoom = () => {
    const updatedDecorations = furnitureList.map((item, index) => {
      const newData = furnitureTransformations[index];
      if (newData) {
        return {
          ...item,
          position: newData.position,
          rotation: newData.rotation,
        };
      }
      return item;
    });
    dispatch(updateRoom({ decorations: updatedDecorations }));
    setSaved(true);
  };

  return (
    <>
      <Snackbar
        open={saved}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Room changes saved"
      />
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
          {furnitureList.map((item, index) => (
            <MovableFurniture
              key={index}
              item={item}
              index={index}
              isSelected={selectedDecor === index}
              onSelect={handleObjectSelection}
            />
          ))}
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
            zIndex: 100, // Ensure it's above the canvas
          }}
        >
          Save Changes
        </button>
      )}
    </>
  );
}
