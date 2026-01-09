import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import React, { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// ========================================
// Custom Line Component
// ========================================
function Line({
  start,
  end,
  color = "#22d3ee",
  opacity = 0.5,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  const lineRef = useRef<THREE.Line>(null!);

  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
    });
    return new THREE.Line(geometry, material);
  }, [start, end, color, opacity]);

  return <primitive object={line} ref={lineRef} />;
}

// ========================================
// Star (Skill Point) Component
// ========================================
function Star({
  position,
  color,
  label,
  index,
  starRefs,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  index: number;
  starRefs: React.MutableRefObject<(THREE.Mesh | null)[]>;
}) {
  const SKILL_TEXT_SIZE = 0.9;

  return (
    <mesh ref={(el) => (starRefs.current[index] = el)} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial color={color} />
      <Html center distanceFactor={5}>
        <div
          style={{
            color: "white",
            fontSize: `${SKILL_TEXT_SIZE}rem`,
            textAlign: "center",
            background: "rgba(0,0,0,0.85)",
            padding: "5px 9px",
            borderRadius: 4,
            border: "1px solid #22d3ee",
            whiteSpace: "nowrap",
            boxShadow: "0 0 8px rgba(34, 211, 238, 0.6)",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>
      </Html>
    </mesh>
  );
}

// ========================================
// Connection Line Between Stars
// ========================================
function Connection({
  start,
  end,
  color = "#22d3ee",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  return <Line start={start} end={end} color={color} opacity={0.6} />;
}

// ========================================
// Skill Constellation (Main 3D Scene)
// ========================================
function SkillConstellation() {
  // Offsets for constellation groups
  const LEFT_OFFSET: [number, number, number] = [-1.8, 0.0, 0];
  const RIGHT_OFFSET: [number, number, number] = [2.2, 0.0, 0];
  const CENTER_OFFSET: [number, number, number] = [0, 0.8, 0];

  // Skill data grouped by constellation
  const skills = {
    hat: [
      { name: "HTML", pos: [-0.3, 0.6, 0] as [number, number, number] },
      { name: "CSS", pos: [-0.1, 1.1, 0] as [number, number, number] },
      { name: "JavaScript", pos: [0.3, 0.5, 0] as [number, number, number] },
      { name: "NoSQL", pos: [0.2, -0.3, 0] as [number, number, number] },
      { name: "Git", pos: [0.8, -0.5, 0] as [number, number, number] },
      { name: "Advanced SQL", pos: [1.0, -0.3, 0] as [number, number, number] },
      { name: "DevOps", pos: [0.7, 0.1, 0] as [number, number, number] },
    ],
    book: [
      { name: "Python", pos: [-0.7, -0.1, 0] as [number, number, number] },
      { name: "C++", pos: [-0.2, -0.1, 0] as [number, number, number] },
      { name: "Java", pos: [-0.7, -0.5, 0] as [number, number, number] },
      { name: "SQL", pos: [-0.2, -0.5, 0] as [number, number, number] },
    ],
    cluster: [
      { name: "Mobile Dev", pos: [0.3, 0, 0] as [number, number, number] },
      { name: "Flutter", pos: [-0.8, 0.4, 0] as [number, number, number] },
      {
        name: "Machine Learning",
        pos: [-0.5, 0.0, 0] as [number, number, number],
      },
    ],
    center: [
      { name: "Full Stack Web Development", pos: [0, 0, 0] as [number, number, number] },
    ],
  };

  // Flatten all skills with base scale
  const allSkills = useMemo(
    () => [
      ...skills.center.map((s) => ({ ...s, baseScale: 0.28 })),
      ...skills.hat.map((s) => ({ ...s, baseScale: 0.1})),
      ...skills.book.map((s) => ({ ...s, baseScale: 0.16 })),
      ...skills.cluster.map((s) => ({ ...s, baseScale: 0.16 })),
    ],
    []
  );

  // Refs and animation state
  const starRefs = useRef<(THREE.Mesh | null)[]>(
    new Array(allSkills.length).fill(null)
  );
  const phases = useMemo(
    () => new Array(allSkills.length).fill(0).map(() => Math.random() * Math.PI * 2),
    [allSkills.length]
  );
  const groupRef = useRef<THREE.Group>(null!);
  const directionRef = useRef(1);
  const color = "#22d3ee";

  // Animation loop
  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (group) {
      const rotationSpeed = 0.004;
      const maxRotation = (40 * Math.PI) / 180;
      group.rotation.y += rotationSpeed * directionRef.current;

      if (group.rotation.y >= maxRotation || group.rotation.y <= -maxRotation) {
        directionRef.current *= -1;
      }
    }

    const time = clock.getElapsedTime();
    starRefs.current.forEach((star, index) => {
      if (star) {
        const base = allSkills[index].baseScale || 0.16;
        const pulse = 0.035 * Math.sin(time * 2.5 + phases[index]);
        star.scale.set(base + pulse, base + pulse, base + pulse);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Center Star */}
      <group position={CENTER_OFFSET}>
        {skills.center.map((s, i) => (
          <Star
            key={`center-${i}`}
            position={s.pos}
            color={color}
            label={s.name}
            index={i}
            starRefs={starRefs}
          />
        ))}
      </group>

      {/* Hat Constellation (Left) */}
      <group position={LEFT_OFFSET}>
        {skills.hat.map((s, i) => (
          <Star
            key={`hat-${i}`}
            position={s.pos}
            color={color}
            label={s.name}
            index={i + skills.center.length}
            starRefs={starRefs}
          />
        ))}
        <Connection start={skills.hat[0].pos} end={skills.hat[1].pos} />
        <Connection start={skills.hat[1].pos} end={skills.hat[2].pos} />
        <Connection start={skills.hat[2].pos} end={skills.hat[3].pos} />
        <Connection start={skills.hat[3].pos} end={skills.hat[4].pos} />
        <Connection start={skills.hat[4].pos} end={skills.hat[5].pos} />
        <Connection start={skills.hat[5].pos} end={skills.hat[0].pos} />
      </group>

      {/* Book Constellation (Right) */}
      <group position={RIGHT_OFFSET}>
        {skills.book.map((s, i) => (
          <Star
            key={`book-${i}`}
            position={s.pos}
            color={color}
            label={s.name}
            index={i + skills.center.length + skills.hat.length}
            starRefs={starRefs}
          />
        ))}
        <Connection start={skills.book[0].pos} end={skills.book[1].pos} />
        <Connection start={skills.book[1].pos} end={skills.book[3].pos} />
        <Connection start={skills.book[3].pos} end={skills.book[2].pos} />
        <Connection start={skills.book[2].pos} end={skills.book[0].pos} />
      </group>

      {/* Cluster Constellation (Upper Right) */}
      <group position={[RIGHT_OFFSET[0], RIGHT_OFFSET[1] + 0.7, RIGHT_OFFSET[2]]}>
        {skills.cluster.map((s, i) => (
          <Star
            key={`cluster-${i}`}
            position={s.pos}
            color={color}
            label={s.name}
            index={
              i + skills.center.length + skills.hat.length + skills.book.length
            }
            starRefs={starRefs}
          />
        ))}
        <Connection start={skills.cluster[0].pos} end={skills.cluster[1].pos} />
        <Connection start={skills.cluster[1].pos} end={skills.cluster[2].pos} />
        <Connection start={skills.cluster[2].pos} end={skills.cluster[0].pos} />
      </group>
    </group>
  );
}

// ========================================
// Main Skills Section Component
// ========================================
const Skills: React.FC = () => {
  return (
    <section
      id="skills"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        scrollSnapAlign: "start",
        background: "transparent",
        position: "relative",
        zIndex: 1,
        padding: "2rem 2rem 0 2rem",
      }}
    >
      {/* Title & Description */}
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          textAlign: "center",
          zIndex: 3,
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "#22d3ee" }}>
          Skills Constellation
        </h1>
        <p
          style={{
            color: "#d1d5db",
            fontSize: "1.1rem",
          }}
        >
          Explore my skills as a constellation of expertise. Hover over stars
          for emphasis and rotate to navigate!
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{ width: "100%", height: "80%", zIndex: 2 }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ambientLight intensity={1.8} />
        <pointLight position={[0, 0, 0]} intensity={2.2} color="#ffffff" />
        <Suspense fallback={null}>
          <SkillConstellation />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Skills;
