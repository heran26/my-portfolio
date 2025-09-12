import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import SolarSystem, { planets } from "./components/SolarSystem";
import type { Planet } from "./components/SolarSystem";
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three-stdlib";

// ---------- Custom Line Component ----------
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

// ---------- Starfield ----------
function Starfield({
  count = 50000000,
  radius = 700,
  height = 50000,
  scrollOffsetRef,
}: {
  count?: number;
  radius?: number;
  height?: number;
  scrollOffsetRef: React.MutableRefObject<number>;
}) {
  const [positions, sizes, colors, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizeArr = new Float32Array(count);
    const colorArr = new Float32Array(count * 3);
    const phaseArr = new Float32Array(count);

    const colorOptions = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#cceeff"),
      new THREE.Color("#ffe4b5"),
    ];

    for (let i = 0; i < count; i++) {
      const r_horizontal = radius * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = r_horizontal * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * height;
      pos[i * 3 + 2] = r_horizontal * Math.sin(theta);

      sizeArr[i] = Math.random() * 1.2 + 0.3;

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colorArr[i * 3] = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;

      phaseArr[i] = Math.random() * Math.PI * 2;
    }
    return [pos, sizeArr, colorArr, phaseArr];
  }, [count, radius, height]);

  const pointsRef = useRef<THREE.Points>(null!);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.elapsedTime;

    uniforms.time.value = t;
    pointsRef.current.position.y = scrollOffsetRef.current * 0.4;
    pointsRef.current.rotation.y = t * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          attribute float phase;
          varying vec3 vColor;
          varying float vPhase;
          void main() {
            vColor = color;
            vPhase = phase;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vPhase;
          uniform float time;
          void main() {
            float twinkle = 0.6 + 0.4 * sin(time * 3.0 + vPhase);
            gl_FragColor = vec4(vColor * twinkle, 1.0);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------- Full-screen star background ----------
function BackgroundStars({
  scrollOffsetRef,
}: {
  scrollOffsetRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 1], fov: 75 }}
    >
      <color attach="background" args={["#020611"]} />
      <Suspense fallback={null}>
        <Starfield
          count={1000000}
          radius={700}
          height={50000}
          scrollOffsetRef={scrollOffsetRef}
        />
      </Suspense>
    </Canvas>
  );
}

// ---------- Skill Constellation ----------
function SkillConstellation() {
  // Customization variables
  const LEFT_OFFSET: [number, number, number] = [-1.5, 0.0, 0];
  const RIGHT_OFFSET: [number, number, number] = [2.5, 0.0, 0];
  const CENTER_OFFSET: [number, number, number] = [0, 1.0, 0];
  const SKILL_TEXT_SIZE: number = 0.6;

  // One star (skill point)
  function Star({ position, color, label, index }: { position: [number, number, number]; color: string; label: string; index: number }) {
    return (
      <mesh ref={(el) => (starRefs.current[index] = el)} position={position}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} />
        <Html center distanceFactor={6}>
          <div style={{ 
            color: "white", 
            fontSize: `${SKILL_TEXT_SIZE}rem`,
            textAlign: "center", 
            background: "rgba(0,0,0,0.8)", 
            padding: "3px 5px", 
            borderRadius: 3, 
            border: "1px solid #22d3ee", 
            whiteSpace: "nowrap",
            boxShadow: "0 0 6px rgba(34, 211, 238, 0.5)"
          }}>
            {label}
          </div>
        </Html>
      </mesh>
    );
  }

  // Lines between stars
  function Connection({ start, end, color = "#22d3ee" }: { start: [number, number, number]; end: [number, number, number]; color?: string }) {
    return <Line start={start} end={end} color={color} opacity={0.5} />;
  }

  // Define grouped constellations with explicit tuple type
  const skills: {
    hat: { name: string; pos: [number, number, number] }[];
    book: { name: string; pos: [number, number, number] }[];
    cluster: { name: string; pos: [number, number, number] }[];
    center: { name: string; pos: [number, number, number] }[];
  } = {
    hat: [
      { name: "HTML", pos: [-0.5, 0.4, 0] },
      { name: "CSS", pos: [0, 0.8, 0] },
      { name: "JavaScript", pos: [0.5, 0.4, 0] },
      { name: "NoSQL", pos: [0.7, -0.3, 0] },
      { name: "Git", pos: [1.0, -0.5, 0] },
      { name: "Advanced SQL", pos: [1.3, -0.3, 0] },
      { name: "DevOps", pos: [1.0, -0.1, 0] },
    ],
    book: [
      { name: "Python", pos: [-0.7, -0.3, 0] },
      { name: "C++", pos: [-0.2, -0.3, 0] },
      { name: "Java", pos: [-0.7, -0.7, 0] },
      { name: "SQL", pos: [-0.2, -0.7, 0] },
    ],
    cluster: [
      { name: "Mobile Dev", pos: [-0.5, 0.2, 0] },
      { name: "Flutter", pos: [-0.8, 0.6, 0] },
      { name: "Machine Learning", pos: [-0.2, 0.6, 0] },
    ],
    center: [{ name: "Full Stack Web Development", pos: [0, 0, 0] }],
  };

  const allSkills = useMemo(() => [
    ...skills.center.map(s => ({ ...s, baseScale: 0.25 })),
    ...skills.hat.map(s => ({ ...s, baseScale: 0.15 })),
    ...skills.book.map(s => ({ ...s, baseScale: 0.15 })),
    ...skills.cluster.map(s => ({ ...s, baseScale: 0.15 })),
  ], []);

  const starRefs = useRef<(THREE.Mesh | null)[]>(new Array(allSkills.length).fill(null));
  const phases = useMemo(() => new Array(allSkills.length).fill(0).map(() => Math.random() * Math.PI * 2), []);

  const groupRef = useRef<THREE.Group>(null!);
  const color = "#22d3ee";

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
    const time = clock.getElapsedTime();
    starRefs.current.forEach((star, index) => {
      if (star) {
        const base = allSkills[index].baseScale || 0.15;
        const pulse = 0.03 * Math.sin(time * 2 + phases[index]);
        star.scale.set(base + pulse, base + pulse, base + pulse);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Center star */}
      <group position={CENTER_OFFSET}>
        {skills.center.map((s, i) => (
          <Star key={`center-${i}`} position={s.pos} color={color} label={s.name} index={i} />
        ))}
      </group>

      {/* Hat constellation (triangle) on left */}
      <group position={LEFT_OFFSET}>
        {skills.hat.map((s, i) => (
          <Star key={`hat-${i}`} position={s.pos} color={color} label={s.name} index={i + skills.center.length} />
        ))}
        <Connection start={skills.hat[0].pos} end={skills.hat[1].pos} />
        <Connection start={skills.hat[1].pos} end={skills.hat[2].pos} />
        <Connection start={skills.hat[2].pos} end={skills.hat[3].pos} />
        <Connection start={skills.hat[3].pos} end={skills.hat[4].pos} />
        <Connection start={skills.hat[4].pos} end={skills.hat[5].pos} />
        <Connection start={skills.hat[5].pos} end={skills.hat[0].pos} />
      </group>

      {/* Book constellation (rectangle) on right */}
      <group position={RIGHT_OFFSET}>
        {skills.book.map((s, i) => (
          <Star key={`book-${i}`} position={s.pos} color={color} label={s.name} index={i + skills.center.length + skills.hat.length} />
        ))}
        <Connection start={skills.book[0].pos} end={skills.book[1].pos} />
        <Connection start={skills.book[1].pos} end={skills.book[3].pos} />
        <Connection start={skills.book[3].pos} end={skills.book[2].pos} />
        <Connection start={skills.book[2].pos} end={skills.book[0].pos} />
      </group>

      {/* Cluster constellation on right */}
      <group position={[RIGHT_OFFSET[0], RIGHT_OFFSET[1] + 0.6, RIGHT_OFFSET[2]]}>
        {skills.cluster.map((s, i) => (
          <Star key={`cluster-${i}`} position={s.pos} color={color} label={s.name} index={i + skills.center.length + skills.hat.length + skills.book.length } />
        ))}
        <Connection start={skills.cluster[0].pos} end={skills.cluster[1].pos} />
        <Connection start={skills.cluster[1].pos} end={skills.cluster[2].pos} />
        <Connection start={skills.cluster[2].pos} end={skills.cluster[0].pos} />
      </group>
    </group>
  );
}

// ---------- Astronaut Avatar (Fallback Sphere) ----------
function AstronautAvatar() {
  const avatarRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (avatarRef.current) {
      avatarRef.current.position.y = Math.sin(clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={avatarRef} position={[15, -3, 0]} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#22d3ee" />
    </mesh>
  );
}

// --- Overlay project details ---
function ProjectDetail({
  planet,
  onBack,
}: {
  planet: Planet | null;
  onBack: () => void;
}) {
  if (!planet) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "rgba(17,24,39,0.9)",
          padding: "2rem",
          borderRadius: "0.75rem",
          maxWidth: "80%",
          width: "90%",
          color: "white",
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
        }}
      >
        <div style={{ width: "33%" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#22d3ee" }}>
            Technologies
          </h3>
          <ul style={{ color: "#d1d5db", listStyle: "disc", paddingLeft: "1.25rem" }}>
            {planet.technologies.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <a
            href={planet.link}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#06b6d4",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.25rem",
              color: "white",
              display: "inline-block",
              marginTop: "0.75rem",
            }}
          >
            View Project
          </a>
        </div>
        <div style={{ width: "67%", position: "relative" }}>
          <button
            onClick={onBack}
            style={{ position: "absolute", top: "0.75rem", right: "1rem", fontSize: "2rem" }}
          >
            ×
          </button>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#22d3ee" }}>
            {planet.project}
          </h2>
          <img src={planet.image} style={{ width: "100%", borderRadius: "0.5rem" }} />
          <p style={{ color: "#d1d5db" }}>{planet.description}</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Thruster Flames Component ----------
function ThrusterFlames({
  active,
  position = [0, 0, 0],
  topRadius = 0.05,
  baseRadius = 0.4,
  thrustLength = 1.5,
}: {
  active: boolean;
  position?: [number, number, number];
  topRadius?: number;
  baseRadius?: number;
  thrustLength?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 200;

  const [positions, opacities, sizes, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = baseRadius * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = r * Math.sin(theta);

      op[i] = Math.random();
      sz[i] = Math.random() * 2 + 1;
      ph[i] = Math.random() * thrustLength;
    }

    return [pos, op, sz, ph];
  }, [count, baseRadius, thrustLength]);

  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      uIsActive: { value: 0.0 },
      thrustLength: { value: thrustLength },
      topRadius: { value: topRadius },
      baseRadius: { value: baseRadius },
      speed: { value: 5.0 },
    }),
    [thrustLength, topRadius, baseRadius]
  );

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    uniforms.time.value += delta;
    uniforms.uIsActive.value = THREE.MathUtils.lerp(
      uniforms.uIsActive.value,
      active ? 1.0 : 0.0,
      0.1
    );
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-opacity" args={[opacities, 1]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        transparent
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          uniform float thrustLength;
          uniform float topRadius;
          uniform float baseRadius;
          uniform float speed;
          attribute float opacity;
          attribute float size;
          attribute float phase;
          varying float vOpacity;
          varying float vFraction;

          void main() {
            vOpacity = opacity;
            vec3 pos = position;
            float y_offset = mod(time * speed + phase, thrustLength);
            pos.y -= y_offset;
            float fraction = y_offset / thrustLength;
            vFraction = fraction;
            float radiusFactor = (topRadius / baseRadius) + fraction * (1.0 - topRadius / baseRadius);
            pos.x *= radiusFactor;
            pos.z *= radiusFactor;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (20.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vOpacity;
          varying float vFraction;
          uniform float uIsActive;

          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            float strength = 1.0 - distance * 2.0;
            float fade = 1.0 - vFraction * 0.5;
            gl_FragColor = vec4(1.0, 0.6, 0.2, strength * vOpacity * fade * uIsActive);
          }
        `}
      />
    </points>
  );
}

// ---------- Rocket Component ----------
function Rocket({
  scrollRef,
  isDragging,
  setIsDragging,
  dragStartY,
  rocketStartY,
  isScrolling,
  setIsScrolling,
  lastRocketY,
  scrollTimeout,
  ROCKET_SCALE,
  FLAME_OFFSET_Y,
  START_Y,
  TRAVEL_DISTANCE,
  END_Y,
  FLAME_TOP_RADIUS,
  FLAME_BASE_RADIUS,
  FLAME_THRUST_LENGTH,
}: {
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  dragStartY: React.MutableRefObject<number>;
  rocketStartY: React.MutableRefObject<number>;
  isScrolling: boolean;
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
  lastRocketY: React.MutableRefObject<number>;
  scrollTimeout: React.MutableRefObject<number | null>;
  ROCKET_SCALE: number;
  FLAME_OFFSET_Y: number;
  START_Y: number;
  TRAVEL_DISTANCE: number;
  END_Y: number;
  FLAME_TOP_RADIUS: number;
  FLAME_BASE_RADIUS: number;
  FLAME_THRUST_LENGTH: number;
}) {
  const rocketRef = useRef<THREE.Group>(null!);
  const gltf = useLoader(GLTFLoader, "/rocket.glb");

  useFrame((_, delta) => {
    if (!rocketRef.current) return;
    if (!isScrolling && !isDragging) {
      rocketRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    const handleScroll = () => {
      if (!rocketRef.current) return;
      const progress = ref.scrollTop / Math.max(1, ref.scrollHeight - ref.clientHeight);
      const newY = START_Y - progress * TRAVEL_DISTANCE;
      rocketRef.current.position.y = newY;
      rocketRef.current.rotation.z = (progress - 0.5) * 0.2;

      if (Math.abs(newY - lastRocketY.current) > 0.01) {
        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = window.setTimeout(() => setIsScrolling(false), 150);
      }
      lastRocketY.current = newY;
    };

    ref.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [scrollRef, START_Y, TRAVEL_DISTANCE, setIsScrolling, scrollTimeout, lastRocketY]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = e.clientY ?? e.pointerY ?? 0;
    rocketStartY.current = rocketRef.current.position.y;
    gsap.to(rocketRef.current.rotation, { x: -0.2, duration: 0.15, yoyo: true, repeat: 1 });
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || !scrollRef.current) return;
    const currentY = e.clientY ?? e.pointerY ?? 0;
    const delta = (currentY - dragStartY.current) * 0.05;
    const newY = rocketStartY.current - delta;

    const clampedY = Math.max(END_Y, Math.min(START_Y, newY));
    rocketRef.current.position.y = clampedY;

    const progress = (START_Y - clampedY) / TRAVEL_DISTANCE;
    const targetScroll =
      progress * (scrollRef.current.scrollHeight - scrollRef.current.clientHeight);
    scrollRef.current.scrollTo({ top: targetScroll, behavior: "auto" });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, scrollRef, START_Y, TRAVEL_DISTANCE]);

  return (
    <group ref={rocketRef} position={[0, START_Y, 0]}>
      <primitive
        object={gltf.scene.clone()}
        scale={[ROCKET_SCALE, ROCKET_SCALE, ROCKET_SCALE]}
        onPointerDown={handlePointerDown}
      />
      <ThrusterFlames
        active={isScrolling || isDragging}
        position={[0, FLAME_OFFSET_Y, 0]}
        topRadius={FLAME_TOP_RADIUS}
        baseRadius={FLAME_BASE_RADIUS}
        thrustLength={FLAME_THRUST_LENGTH}
      />
    </group>
  );
}

// ---------- Rocket Scrollbar Component ----------
function RocketScrollbar({
  scrollRef,
  sectionCount: _sectionCount,
}: {
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  sectionCount: number;
}) {
  // --- CUSTOMIZATION VARIABLES ---
  const ROCKET_SCALE = 2.0;
  const FLAME_OFFSET_Y = -0.8;
  const VERTICAL_PADDING = 3.5;
  const FLAME_TOP_RADIUS = 0.05;
  const FLAME_BASE_RADIUS = 2.4;
  const FLAME_THRUST_LENGTH = 2.5;
  // --- END CUSTOMIZATION VARIABLES ---

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const rocketStartY = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastRocketY = useRef(0);
  const scrollTimeout = useRef<number | null>(null);

  const TRACK_HEIGHT = 18;
  const TRAVEL_DISTANCE = TRACK_HEIGHT - VERTICAL_PADDING * 2;
  const START_Y = TRAVEL_DISTANCE / 2;
  const END_Y = -TRAVEL_DISTANCE / 2;

  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 80,
        height: "100vh",
        zIndex: 20,
        background: "transparent",
        pointerEvents: "auto",
      }}
      orthographic
      camera={{ zoom: 40, position: [0, 0, 10] }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Suspense fallback={null}>
        <Rocket
          scrollRef={scrollRef}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          dragStartY={dragStartY}
          rocketStartY={rocketStartY}
          isScrolling={isScrolling}
          setIsScrolling={setIsScrolling}
          lastRocketY={lastRocketY}
          scrollTimeout={scrollTimeout}
          ROCKET_SCALE={ROCKET_SCALE}
          FLAME_OFFSET_Y={FLAME_OFFSET_Y}
          START_Y={START_Y}
          TRAVEL_DISTANCE={TRAVEL_DISTANCE}
          END_Y={END_Y}
          FLAME_TOP_RADIUS={FLAME_TOP_RADIUS}
          FLAME_BASE_RADIUS={FLAME_BASE_RADIUS}
          FLAME_THRUST_LENGTH={FLAME_THRUST_LENGTH}
        />
      </Suspense>
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[0.1, TRACK_HEIGHT, 0.1]} />
        <meshStandardMaterial color={"#1f2937"} metalness={0.5} roughness={0.5} />
      </mesh>
    </Canvas>
  );
}

// --- Main App ---
function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [isZoomComplete, setIsZoomComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<THREE.Object3D | null>(null);
  const scrollOffsetRef = useRef(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  const images = ["/src/assets/images/1.png", "/src/assets/images/2.png", "/src/assets/images/3.png"];
  const descriptions = [
    "Exploring the frontiers of code in Addis Ababa.",
    "Building innovative solutions with passion.",
    "Celebrating achievements in software engineering."
  ];
  const aboutParagraph = (
    <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
      I'm Heran Weyessa, a Full Stack Software Engineer from Addis Ababa, Ethiopia, with 6 years of experience in coding, machine learning AI, web, and mobile development. Graduated from Addis Ababa Science and Technology University (2020-2025), proficient in C++, Java, Python, HTML/CSS/JS, SQL/NoSQL, Git, and Flutter. I've worked at Kifiya Financial Technology, freelanced, and interned at Yeneta Code, building projects like e-commerce sites, AI recommendation systems, and educational apps. Achieved 3rd place at the Google Developer Student Club Hackathon—excited to collaborate on innovative tech journeys!
    </p>
  );

  const slides = [
    { content: aboutParagraph, isImage: false },
    ...images.map((img, index) => ({
      content: (
        <>
          <img
            src={img}
            alt={`About me - Image ${index + 1}`}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          />
          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.9rem", marginTop: "1rem" }}>
            {descriptions[index]}
          </p>
        </>
      ),
      isImage: true,
    })),
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showCarousel) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showCarousel, slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && scrollRef.current) {
      const top = element.offsetTop;
      scrollRef.current.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return;

    const handleScroll = () => {
      scrollOffsetRef.current = ref.scrollTop;
    };

    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollRef.current) return;
      e.preventDefault();
      const direction = Math.sign(e.deltaY);
      if (direction === 0) return;
      const sectionHeight = window.innerHeight;
      const currentScroll = scrollRef.current.scrollTop;
      const nextScroll = currentScroll + direction * sectionHeight;
      scrollRef.current.scrollTo({ top: nextScroll, behavior: "smooth" });
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <>
      <BackgroundStars scrollOffsetRef={scrollOffsetRef} />
      <RocketScrollbar scrollRef={scrollRef} sectionCount={6} />

      {/* Top Navigation */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "rgba(2,6,17,0.8)",
          zIndex: 10,
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        <nav>
          <ul style={{ display: "flex", listStyle: "none", gap: "2rem" }}>
            <li>
              <button
                onClick={() => scrollToSection("home")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("about")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("skills")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Skills
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("experience")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Experience
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("projects")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection("contact")}
                style={{
                  color: "white",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main scroll container */}
      <div
        id="scroll-container"
        ref={scrollRef}
        style={{
          width: "100%",
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          background: "transparent",
          position: "relative",
          zIndex: 1,
          scrollBehavior: "smooth",
          scrollbarWidth: "none" as any,
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          #scroll-container::-webkit-scrollbar { display: none; }
        `}</style>

        {/* HOME SECTION */}
        <section
          id="home"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            scrollSnapAlign: "start",
            background: "transparent",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Canvas
            style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2 }}
            camera={{ position: [0, 0, 10], fov: 50 }}
          >
            <Suspense fallback={null}>
              <AstronautAvatar />
            </Suspense>
          </Canvas>
          <img
            src="/public/me.png"
            style={{ width: "200px", borderRadius: "50%", marginBottom: "1rem", zIndex: 3 }}
          />
          <h1 style={{ fontSize: "2.5rem", color: "#22d3ee", zIndex: 3 }}>Hi, I'm Heran 👋</h1>
          <p style={{ maxWidth: "600px", textAlign: "center", color: "#d1d5db", zIndex: 3 }}>
            I’m a software engineer crafting stellar web experiences in a cosmic universe. Scroll to
            explore my skills and projects!
          </p>
          <p style={{ marginTop: "2rem", fontSize: "1rem", color: "#9ca3af", zIndex: 3 }}>
            ⬇ Scroll Down ⬇
          </p>
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            scrollSnapAlign: "start",
            background: "transparent",
            position: "relative",
            zIndex: 1,
            padding: "2rem",
          }}
        >
          <Canvas
            style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2 }}
            camera={{ position: [0, 0, 10], fov: 50 }}
          >
            <Suspense fallback={null}>
              <AstronautAvatar />
            </Suspense>
          </Canvas>
          <h1 style={{ fontSize: "2.5rem", color: "#22d3ee", zIndex: 3, marginBottom: "2rem" }}>About Me</h1>
          
          {showCarousel && (
            <div style={{ maxWidth: "800px", textAlign: "center", color: "#d1d5db", zIndex: 3, position: "relative" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
                <button
                  onClick={handlePrevSlide}
                  style={{
                    position: "absolute",
                    left: "-80px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(34, 211, 238, 0.9)",
                    border: "none",
                    color: "white",
                    fontSize: "3rem",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 4,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  ←
                </button>
                <div style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {slides[currentSlideIndex].content}
                </div>
                <button
                  onClick={handleNextSlide}
                  style={{
                    position: "absolute",
                    right: "-80px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(34, 211, 238, 0.9)",
                    border: "none",
                    color: "white",
                    fontSize: "3rem",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 4,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  }}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SKILLS SECTION */}
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
          <div style={{
            width: "100%",
            maxWidth: "800px",
            textAlign: "center",
            zIndex: 3,
            marginTop: "2rem",
            marginBottom: "1rem"
          }}>
            <h1 style={{ fontSize: "2.5rem", color: "#22d3ee" }}>Skills Constellation</h1>
            <p style={{ color: "#d1d5db", fontSize: "1.1rem" }}>
              Explore my skills as a constellation of expertise. Hover over stars for emphasis and rotate to navigate!
            </p>
          </div>
          <Canvas
            style={{ width: "100%", height: "80%", zIndex: 2 }}
            camera={{ position: [0, 0, 5], fov: 45 }}
          >
            <ambientLight intensity={1.5} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
            <Suspense fallback={null}>
              <SkillConstellation />
              <AstronautAvatar />
              <OrbitControls enableZoom={true} enablePan={true} />
            </Suspense>
          </Canvas>
        </section>

        {/* EXPERIENCE SECTION */}
        <section
          id="experience"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            scrollSnapAlign: "start",
            background: "transparent",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Canvas
            style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2 }}
            camera={{ position: [0, 0, 10], fov: 50 }}
          >
            <Suspense fallback={null}>
              <AstronautAvatar />
            </Suspense>
          </Canvas>
          <h1 style={{ fontSize: "2.5rem", color: "#22d3ee", zIndex: 3 }}>Experience</h1>
          <div style={{ maxWidth: "600px", textAlign: "left", color: "#d1d5db", zIndex: 3 }}>
            <h3 style={{ fontSize: "1.5rem", color: "#22d3ee" }}>
              Software Engineer at Company X (2022 - Present)
            </h3>
            <p>Developed web applications using React and Node.js, orbiting through collaborative missions.</p>
            <h3 style={{ fontSize: "1.5rem", color: "#22d3ee" }}>Intern at Company Y (2021)</h3>
            <p>Assisted in backend development and database management, gaining agile experience.</p>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section
          id="projects"
          style={{
            minHeight: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Canvas
            style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
            camera={{ position: [80, 60, 80], fov: 50 }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 10]} />
            <pointLight position={[0, 5, 0]} intensity={4} />
            <Suspense fallback={null}>
              <SolarSystem
                selectedPlanet={selectedPlanet}
                setSelectedPlanet={setSelectedPlanet}
                setIsZoomComplete={setIsZoomComplete}
              />
              <AstronautAvatar />
              <OrbitControls ref={orbitRef as any} enableZoom />
            </Suspense>
          </Canvas>

          {isZoomComplete && (
            <ProjectDetail
              planet={selectedPlanet !== null ? planets[selectedPlanet] : null}
              onBack={() => {
                setSelectedPlanet(null);
                setIsZoomComplete(false);
              }}
            />
          )}
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            scrollSnapAlign: "start",
            background: "transparent",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Canvas
            style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2 }}
            camera={{ position: [0, 0, 10], fov: 50 }}
          >
            <Suspense fallback={null}>
              <AstronautAvatar />
            </Suspense>
          </Canvas>
          <h1 style={{ fontSize: "2.5rem", color: "#22d3ee", zIndex: 3 }}>Contact Me</h1>
          <p style={{ maxWidth: "600px", textAlign: "center", color: "#d1d5db", zIndex: 3 }}>
            Send a transmission to example@email.com or connect via LinkedIn. Open to new
            missions!
          </p>
        </section>
      </div>
    </>
  );
}

export default App;