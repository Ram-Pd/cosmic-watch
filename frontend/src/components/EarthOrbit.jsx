import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";

/* Rotating Earth */
function Earth() {
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#1e90ff" roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

/* Atmospheric glow */
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.08, 64, 64]} />
      <meshBasicMaterial
        color="#4da6ff"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

/* Orbiting asteroid */
function Asteroid() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (ref.current) {
      ref.current.position.x = Math.cos(t) * 3;
      ref.current.position.z = Math.sin(t) * 3;
      ref.current.rotation.x += 0.02;
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshStandardMaterial color="gray" roughness={1} />
    </mesh>
  );
}

/* Main Scene */
export default function EarthOrbit() {
  return (
    <div className="w-full h-[420px] rounded-2xl overflow-hidden border border-gray-700">
      <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />

        {/* Stars background */}
        <Stars radius={80} depth={50} count={5000} factor={4} fade />

        {/* Objects */}
        <Earth />
        <Atmosphere />
        <Asteroid />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
