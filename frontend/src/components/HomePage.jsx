import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import NavBar from "./NavBar";
import HUD from "./home/HUD";
import PlaceholderCafe from "../models/PlaceholderCafe";
import "../css/HomePage.css";

export default function HomePage() {
	const adjustForScreenSize = () => {
		const isSmallScreen = window.innerWidth < 800;
		return {
			scale: isSmallScreen ? [0.9, 0.9, 0.9] : [30, 30, 30],
			position: [0, -15, 0],
		};
	};

	const { scale: roomScale, position: roomPosition } = adjustForScreenSize();

	return (
		<section className="w-full h-screen relative">
			<HUD />
			<Canvas
				camera={{ position: [-75, 60, 75], fov: 60 }}
				className="w-full h-screen bg-gray-800"
			>
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
		</section>
	);
}
