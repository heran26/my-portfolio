// App.tsx
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three-stdlib";

import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    THREE.DefaultLoadingManager.onLoad = () => {
      setIsLoading(false);
    };

    return () => {
      THREE.DefaultLoadingManager.onLoad = () => {};
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#020611",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          Loading...
        </div>
      )}
      <BackgroundStars scrollOffsetRef={scrollOffsetRef} />
      <RocketScrollbar scrollRef={scrollRef} sectionCount={6} />

      {/* Top Navigation */}
      {/* Top Navigation - Centered pill-style with yellow border */}
<div
  style={{
    position: "fixed",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    background: "rgba(192, 47, 144, 0.75)", // your pink color
    border: "2px solid #fbbf24",           // yellow border (amber-400)
    borderRadius: "9999px",                 // fully rounded pill shape
    padding: "0.75rem 2rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  }}
>
  <nav>
    <ul
      style={{
        display: "flex",
        listStyle: "none",
        margin: 0,
        padding: 0,
        gap: "2.5rem",
      }}
    >
      <li>
        <button
          onClick={() => scrollToSection("home")}
          style={{
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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
            padding: "0.5rem 0",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
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

        <Home />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </>
  );
}

export default App;