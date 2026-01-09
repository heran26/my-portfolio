// src/components/SolarSystem.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, Vector3 } from "three";
import { useGLTF, Line, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";



// ---------------- Types ----------------
export interface Planet {
  name: string;
  distance: number;
  speed: number;
  size: number;
  project: string;
  link: string;
  initialAngle: number;
  description: string;
  image: string;
  images?: string[];
  technologies: string[];
  orientation?: 'portrait' | 'landscape';  // ← Add this (optional)
}

export interface SolarSystemProps {
  selectedPlanet: number | null;
  setSelectedPlanet: React.Dispatch<React.SetStateAction<number | null>>;
  setIsZoomComplete: React.Dispatch<React.SetStateAction<boolean>>;
  currentGuideIndex?: number; // -1 = no guide, 0..8 = guide for that planet
}

// ---------------- Data ----------------
export const planets: Planet[] = [
  {
    name: "Mercury",
    distance: 13,
    speed: 0.5,
    size: 1.6,
    project: "Personalized and Inclusive Learning App for Kids",
    link: "https://github.com/heran26/final-year-project2",
    initialAngle: 0,
    description:
      "A personalized and inclusive learning app for children aged 4 to 14, featuring interactive games and digital books. The app helps kids learn letters and words, explore cooking basics, discover outer space, and practice sign language through fun, age-appropriate activities. Designed to support different learning styles, it creates an engaging and accessible learning experience for every child.",
    image: "/images/project1.png",
    images: [
  "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg",
],
    technologies: ["Flutter", "Node JS", "Express JS", "Python", "Mongo DB", "Supabase"],
  },
  {
    name: "Venus",
    distance: 20,
    speed: 0.35,
    size: 1.8,
    project: "Queue Managment System",
    link: "https://heran-queue-managment-system-burz9c9lw-herans-projects-649510bd.vercel.app/",
    initialAngle: Math.PI,
    description:
      "The Queue Management System allows users to buy tickets and register in a queue online, helping them avoid long waiting times and making the process faster and easier.",
    image: "/images/project2.png",
    images: [
  "web1.jpg", "web2.jpg", "web3.jpg", "web4.jpg", "web5.jpg"],
    technologies: ["React", "Vite", "JavaScript", "Node.js", "Express.js", "MongoDB", "Vercel"],
  },
  {
    name: "Earth",
    distance: 27,
    speed: 0.3,
    size: 1.9,
    project: "Planogram Mobile App",
    link: "https://github.com/heran26/planogram",
    initialAngle: Math.PI / 4,
    description:
      "A cross-platform mobile application built with Flutter that uses AI-powered object detection and segmentation (YOLOv8) to scan retail shelves, identify products, and detect misplaced items. The app provides real-time compliance feedback against predefined planograms, generates reports, and helps retailers improve shelf organization, inventory management, and operational efficiency. The backend is powered by Flask, delivering AI predictions seamlessly to the mobile interface.",
    image: "/images/project3.png",
     images: [
  "plan1.PNG", "plan2.PNG", "plan3.PNG", "plan4.PNG", "plan5.PNG", "plan6.PNG", "plan7.PNG",],
    technologies: ["Flutter", "Express", "NodeJs", "MongoDB", "Python", "Flask", "YOLOv8", "Roboflow", "Polygonal Instance Segmentation"],
  },
  {
    name: "Mars",
    distance: 34,
    speed: 0.25,
    size: 1.7,
    project: "Plant Disease Detection & Management App",
    link: "https://github.com/heranulcha/project4",
    initialAngle: Math.PI / 2,
    description:
      "This is a smart mobile application that helps farmers detect plant diseases early using deep learning and image recognition. By scanning plant leaves, the app identifies diseases and provides detailed information on symptoms, prevention methods, and treatment solutions.The app also includes an integrated agricultural marketplace, allowing farmers to purchase fertilizers and equipment needed for treatment, along with a merchant panel for sellers to manage and list their products. Planto combines AI and mobile technology to support farmers in improving crop health, reducing losses, and increasing productivity.",
    image: "/images/project4.png",
     images: [
  "plant1.PNG", "plant2.PNG", "plant3.PNG"],
    technologies: ["Python", "TensorFlow", "Keras", "Convolutional Neural Networks", "TensorFlow Lite", "Jupyter Notebook", "Flutter", "Dart", "Firebase"],
  },
  {
    name: "Jupiter",
    distance: 41,
    speed: 0.1,
    size: 2.4,
    project: "Inter-Institutional Portal",
    link: "https://github.com/heran26/InterInstitutional-portal.git",
    initialAngle: (3 * Math.PI) / 4,
    description:
      "DataExchange is a secure digital platform designed to enable Ethiopian government institutions to share data and services efficiently through modern technology. The system replaces manual, paper-based processes with a centralized, API-driven solution that allows institutions to register, request data, review access, and exchange information securely under administrative oversight. By connecting multiple public institutions on one platform, DataExchange helps reduce delays, improve transparency, enhance collaboration, and support better decision-making. The platform ensures high reliability, strong security, and 24/7 access, ultimately improving the quality and speed of public services delivered to citizens.",
    image: "/images/project5.png",
    images: [
  "inter1.PNG", "inter2.PNG", "inter3.PNG", "inter4.PNG"],
    technologies: ["React Native", "Node.js", "TypeScript", "Express.js", "SQL", ],
  },
  {
    name: "Saturn",
    distance: 48,
    speed: 0.08,
    size: 2.2,
    project: "Project 6",
    link: "https://github.com/heranulcha/project6",
    initialAngle: Math.PI,
    description:
      "Description for Project 6. This project features complex state management and a focus on data visualization.",
    image: "/images/project6.png",
    technologies: ["React", "D3.js", "Redux"],
  },
  {
    name: "Uranus",
    distance: 55,
    speed: 0.05,
    size: 2.1,
    project: "Project 7",
    link: "https://github.com/heranulcha/project7",
    initialAngle: (5 * Math.PI) / 4,
    description:
      "Description for Project 7. A personal project to explore new technologies like GraphQL and serverless functions.",
    image: "/images/project7.png",
    technologies: ["GraphQL", "AWS Lambda", "TypeScript"],
  },
  {
    name: "Neptune",
    distance: 62,
    speed: 0.04,
    size: 2.1,
    project: "Project 8",
    link: "https://github.com/heranulcha/project8",
    initialAngle: (3 * Math.PI) / 2,
    description:
      "Description for Project 8, highlighting the challenges faced and the creative solutions I implemented.",
    image: "/images/project8.png",
    technologies: ["Python", "Django", "PostgreSQL"],
  },
  {
    name: "Pluto",
    distance: 69,
    speed: 0.03,
    size: 1.5,
    project: "Project 9",
    link: "https://github.com/heranulcha/project9",
    initialAngle: (7 * Math.PI) / 4,
    description:
      "Description for Project 9, a fun experiment with 3D graphics and interactive animations using Three.js.",
    image: "/images/project9.png",
    technologies: ["Three.js", "TypeScript", "React"],
  },
];

// ---------------- Helpers ----------------
function createOrbitPath(radius: number, segments: number = 64) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new Vector3(Math.sin(angle) * radius, 0, Math.cos(angle) * radius));
  }
  return points;
}

// ---------------- Component ----------------
function SolarSystem({
  selectedPlanet,
  setSelectedPlanet,
  setIsZoomComplete,
  currentGuideIndex = -1,
}: SolarSystemProps) {
  const sunRef = useRef<Mesh>(null);
  const planetRefs = useRef<(Mesh | null)[]>([]);

  const { camera, controls } = useThree();
  const defaultCameraPosition = useMemo(() => new Vector3(80, 60, 80), []);
  const defaultTarget = useMemo(() => new Vector3(0, 5, 0), []);

  const sunData = useGLTF("/models/sun.glb", false);
  const mercuryData = useGLTF("/models/mercury.glb", false);
  const venusData = useGLTF("/models/venus.glb", false);
  const earthData = useGLTF("/models/earth.glb", false);
  const marsData = useGLTF("/models/mars.glb", false);
  const jupiterData = useGLTF("/models/jupiter.glb", false);
  const saturnData = useGLTF("/models/saturn.glb", false);
  const uranusData = useGLTF("/models/uranus.glb", false);
  const neptuneData = useGLTF("/models/neptune.glb", false);
  const plutoData = useGLTF("/models/pluto.glb", false);

  const planetModels = useMemo(
    () => [
      mercuryData,
      venusData,
      earthData,
      marsData,
      jupiterData,
      saturnData,
      uranusData,
      neptuneData,
      plutoData,
    ],
    [
      mercuryData,
      venusData,
      earthData,
      marsData,
      jupiterData,
      saturnData,
      uranusData,
      neptuneData,
      plutoData,
    ]
  );

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // Orbit + rotation
    planetRefs.current.forEach((planet, index) => {
      if (planet) {
        const { distance, speed, initialAngle } = planets[index];
        const angle = initialAngle + elapsedTime * speed;
        planet.position.x = Math.sin(angle) * distance;
        planet.position.z = Math.cos(angle) * distance;
        planet.rotation.y += 0.01;
      }
    });

    if (sunRef.current) sunRef.current.rotation.y += 0.002;

    // Camera behavior
    if (selectedPlanet === null) {
      camera.position.lerp(defaultCameraPosition, 0.2);
      if (controls) {
        (controls as OrbitControlsImpl).target.lerp(defaultTarget, 0.2);
        (controls as OrbitControlsImpl).update();
      }
      setIsZoomComplete(false);
    } else {
      const planetRef = planetRefs.current[selectedPlanet];
      if (planetRef) {
        const planetPosition = new Vector3();
        planetRef.getWorldPosition(planetPosition);
        const planetData = planets[selectedPlanet];
        const offset = new Vector3(0, planetData.size * 1.2, 5 + planetData.size * 0.5);
        const targetPosition = planetPosition.clone().add(offset);

        camera.position.lerp(targetPosition, 0.2);
        if (controls) {
          (controls as OrbitControlsImpl).target.lerp(planetPosition, 0.2);
          (controls as OrbitControlsImpl).update();
        }

        if (camera.position.distanceTo(targetPosition) < 10) {
          setIsZoomComplete(true);
        }
      }
    }
  });

  return (
    <group position={[0, 5, 0]}>
      {selectedPlanet === null && (
        <mesh ref={sunRef} position={[0, 0, 0]}>
          <primitive object={sunData.scene.clone()} scale={1.0} />
        </mesh>
      )}

      {planets.map((planet, index) => {
        const planetModel = planetModels[index].scene;

        if (!planetModel || !planetModel.children.length) return null;

        const isVisible = selectedPlanet === null || selectedPlanet === index;
        if (!isVisible) return null;

        const isCurrentGuide = currentGuideIndex === index;

        return (
          <group key={`${planet.name}-group`}>
            {selectedPlanet === null && (
              <Line points={createOrbitPath(planet.distance)} color="gray" lineWidth={1} />
            )}

            <mesh
              ref={(el) => {
                if (el) planetRefs.current[index] = el;
              }}
              onClick={(e) => {
                if (selectedPlanet === null) {
                  e.stopPropagation();
                  setSelectedPlanet(index);
                }
              }}
            >
              <primitive object={planetModel.clone()} scale={planet.size * 2} />

              {/* Guide tooltip - shows only when it's the current guided planet and no project is selected */}
              {isCurrentGuide && selectedPlanet === null && (
                <Html
                  center
                  position={[0, planet.size * 2.8 + 1, 0]}
                  style={{
                    transform: "translate(-50%, -100%)",
                    background: "rgba(30, 41, 59, 0.92)",
                    color: "#e2e8f0",
                    padding: "14px 22px",
                    borderRadius: "16px",
                    border: "2px solid #fbbf24",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    boxShadow: "0 6px 20px rgba(251, 191, 36, 0.35)",
                    backdropFilter: "blur(6px)",
                    zIndex: 100,
                  }}
                >
                   Project {index + 1}
                </Html>
              )}
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default SolarSystem;