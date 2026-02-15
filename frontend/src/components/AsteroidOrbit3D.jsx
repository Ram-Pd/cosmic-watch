import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Line,
  useTexture,
} from "@react-three/drei";
import { useRef } from "react";

/* 🌍 Real Earth (SAFE TEXTURE LOAD) */
function Earth() {
  const ref = useRef();

  // Safe texture loading
  let earthTexture = null;
  try {
    earthTexture = useTexture("/textures/earth.jpg");
  } catch {
    earthTexture = null;
  }

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture || null}
          color={earthTexture ? "white" : "#1e90ff"}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.08, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.25}
        />
      </mesh>
    </>
  );
}

/* 🪨 Asteroid */
function Asteroid({ index, velocity, hazardous }) {
  const ref = useRef();

  const radius = 3 + index * 0.8;
  const speed = (velocity || 5) / 50;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshStandardMaterial
        color={hazardous ? "#ff3030" : "#888"}
        emissive={hazardous ? "#550000" : "#000"}
        roughness={1}
      />
    </mesh>
  );
}

/* Orbit path */
function OrbitPath({ radius }) {
  const points = [];

  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    points.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
  }

  return (
    <Line
      points={points}
      color="#666"
      transparent
      opacity={0.35}
    />
  );
}

/* 🚀 Scene */
export default function AsteroidOrbit3D({ asteroids = [] }) {
  const displayAsteroids = asteroids.slice(0, 6);

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-gray-700">
      <Canvas camera={{ position: [0, 3, 9], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[6, 5, 5]} intensity={1.5} />

        {/* Space */}
        <Stars
          radius={150}
          depth={80}
          count={9000}
          factor={6}
          fade
        />

        <Earth />

        {displayAsteroids.map((a, i) => (
          <group key={a.id}>
            <OrbitPath radius={3 + i * 0.8} />
            <Asteroid
              index={i}
              velocity={a.velocity}
              hazardous={a.hazardous}
            />
          </group>
        ))}

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
