// src/components/SolarSystem.tsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import {
  Mesh,
  Vector3,
} from "three";
import { useGLTF, Line } from "@react-three/drei";
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
  technologies: string[];
}

// ---------------- Data ----------------
// eslint-disable-next-line react-refresh/only-export-components
export const planets: Planet[] = [
  {
    name: "Mercury",
    distance: 13,
    speed: 0.5,
    size: 1.6,
    project: "Project 1",
    link: "https://github.com/heranulcha/project1",
    initialAngle: 0,
    description:
      "A detailed description of Project 1, focusing on its goals, the technologies used, and my role in its development.",
    image: "/images/project1.png",
    technologies: ["Java", "Python", "React"],
  },
  {
    name: "Venus",
    distance: 20,
    speed: 0.35,
    size: 1.8,
    project: "Project 2",
    link: "https://github.com/heranulcha/project2",
    initialAngle: Math.PI,
    description:
      "Description for Project 2. This project solved a specific problem by implementing a unique algorithm and a user-friendly interface.",
    image: "/images/project2.png",
    technologies: ["TypeScript", "Node.js", "MongoDB"],
  },
  {
    name: "Earth",
    distance: 27,
    speed: 0.3,
    size: 1.9,
    project: "Project 3",
    link: "https://github.com/heranulcha/project3",
    initialAngle: Math.PI / 4,
    description:
      "Description for Project 3. A collaborative effort that involved version control, agile methodologies, and resulted in a high-performance web app.",
    image: "/images/project3.png",
    technologies: ["React", "Express", "PostgreSQL"],
  },
  {
    name: "Mars",
    distance: 34,
    speed: 0.25,
    size: 1.7,
    project: "Project 4",
    link: "https://github.com/heranulcha/project4",
    initialAngle: Math.PI / 2,
    description:
      "Description for Project 4. I was responsible for the back-end architecture, database design, and API development.",
    image: "/images/project4.png",
    technologies: ["Java", "Spring Boot", "MySQL"],
  },
  {
    name: "Jupiter",
    distance: 41,
    speed: 0.1,
    size: 2.4,
    project: "Project 5",
    link: "https://github.com/heranulcha/project5",
    initialAngle: (3 * Math.PI) / 4,
    description:
      "Description for Project 5, a mobile-first application built with React Native and integrated with various third-party services.",
    image: "/images/project5.png",
    technologies: ["React Native", "Firebase", "TypeScript"],
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
interface SolarSystemProps {
  selectedPlanet: number | null;
  setSelectedPlanet: (index: number | null) => void;
  setIsZoomComplete: (value: boolean) => void;
}

function SolarSystem({ selectedPlanet, setSelectedPlanet, setIsZoomComplete }: SolarSystemProps) {
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

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // orbit + rotation
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

    // camera behavior
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
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default SolarSystem;