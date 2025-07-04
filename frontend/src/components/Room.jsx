import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as THREE from "three";
import EmptyRoom from "../models/EmptyRoom";
import {
  fetchRoom,
  updateRoom,
  updateDecorationPosition,
  updateDecorationRotation,
} from "../features/roomSlice";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

// Dynamically imports a furniture component by model name and loads it lazily
const loadFurniture = (model) =>
  lazy(() =>
    import(`../models/furniture/${model}.jsx`).catch(
      () => import("../models/furniture/Error.jsx")
    )
  );

// MovableFurniture handles selection and transformation logic per item
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
            groupRef.current.position.y, // Keep original Y position
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
      const positionStep = 0.5;
      if (event.key === "ArrowLeft") {
        groupRef.current.rotation.y += rotationStep;
      } else if (event.key === "ArrowRight") {
        groupRef.current.rotation.y -= rotationStep;
      } else if (event.key === "ArrowUp") {
        groupRef.current.position.y += positionStep;
      } else if (event.key === "ArrowDown") {
        groupRef.current.position.y -= positionStep;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected]);

  // When deselected, commit the final position and rotation to Redux
  useEffect(() => {
    if (!isSelected && groupRef.current) {
      const finalPos = groupRef.current.position.toArray();
      const finalRot = groupRef.current.rotation.toArray().slice(0, 3);
      dispatch(
        updateDecorationPosition({
          index,
          position: finalPos,
        })
      );
      dispatch(
        updateDecorationRotation({
          index,
          rotation: finalRot,
        })
      );
    }
  }, [isSelected, index, dispatch]);

  const DynamicFurniture = loadFurniture(item.decorId.modelID);

  return (
    <group
      ref={groupRef}
      position={item.position}
      rotation={item.rotation}
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

export default function RoomScene({ isEditable = false }) {
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

  // Used in "Changes Saved" toast notification
  const [saved, setSaved] = useState(false);
  const handleClose = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setSaved(false);
  };

  // Handles the setting of selectedDecor when the mouse is clicked
  const handleObjectSelection = (index) => {
    if (!isEditable) return;
    //    setSelectedDecor((prev) => (prev === index ? null : index)); !!!
    if (selectedDecor === index) {
      setSelectedDecor(null);
    } else {
      setSelectedDecor(index);
    }
  };
  const handleBackgroundClick = () => {
    if (!isEditable) return;
    setSelectedDecor(null);
  };

  // Save transformations to the backend
  const handleEditRoom = () => {
    dispatch(updateRoom({ decorations: furnitureList }));
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
      <Stack
        direction="row"
        sx={{
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
        }}
      >
        {isEditable && (
          <Stack
            direction="column"
            sx={{
              color: "white",
            }}
          >
            <h4 style={{ margin: 0, fontWeight: "bold" }}>Controls</h4>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                fontSize: "12px",
                mt: 1,
              }}
            >
              <div>
                <strong>Left click:</strong>
                <br />
                select/deselect item
              </div>
              <div>
                <strong>Move cursor:</strong>
                <br />
                reposition selected item
              </div>
              <div>
                <strong> ↑ & ↓ key:</strong>
                <br />
                raise/lower selected item
              </div>
              <div>
                <strong>← & → key:</strong>
                <br />
                rotate selected item
              </div>
            </Stack>

            <button
              onClick={handleEditRoom}
              style={{
                marginTop: "12px",
                padding: "5px 10px",
                backgroundColor: "#0a571f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                zIndex: 100,
              }}
            >
              Save Changes
            </button>
          </Stack>
        )}
        <Canvas
          camera={{ position: [-60, 48, 60], fov: 60 }}
          onPointerMissed={handleBackgroundClick}
        >
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
      </Stack>
    </>
  );
}
