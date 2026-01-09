// src/sections/Projects.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import SolarSystem from "../components/SolarSystem";
import { planets } from "../components/SolarSystem";
import type { Planet } from "../components/SolarSystem";
import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Overlay project details
function ProjectDetail({
  planet,
  onBack,
}: {
  planet: Planet | null;
  onBack: () => void;
}) {
  const images = planet?.images || (planet?.image ? [planet.image] : []);
  const orientation = planet?.orientation || 'landscape'; // Now safe to use

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!planet) return null;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const thumbnailWidth = orientation === 'portrait' ? 90 : 140;
  const thumbnailHeight = orientation === 'portrait' ? 140 : 90;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        background: "rgba(0,0,0,0.65)",
      }}
    >
      <div
        style={{
          background: "rgba(17,24,39,0.94)",
          padding: "2.5rem",
          borderRadius: "1rem",
          maxWidth: "90%",
          width: "min(1200px, 90%)",
          color: "white",
          display: "flex",
          flexDirection: "row",
          gap: "2.5rem",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Left column - Technologies + Link */}
        <div style={{ flex: "0 0 33%", minWidth: "260px" }}>
          <h3 style={{ fontSize: "1.7rem", fontWeight: 600, color: "#22d3ee", marginBottom: "1.2rem" }}>
            Technologies
          </h3>
          <ul style={{ color: "#d1d5db", listStyle: "disc", paddingLeft: "1.6rem", lineHeight: "1.8" }}>
            {planet.technologies.map((t: string, i: number) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <a
            href={planet.link}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#06b6d4",
              padding: "0.8rem 1.6rem",
              borderRadius: "0.5rem",
              color: "white",
              display: "inline-block",
              marginTop: "2rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            View Project →
          </a>
        </div>

        {/* Right column - Content */}
        <div style={{ flex: 1, position: "relative" }}>
          <button
            onClick={onBack}
            style={{
              position: "absolute",
              top: "0.6rem",
              right: "0.8rem",
              fontSize: "2.4rem",
              background: "none",
              border: "none",
              color: "#e2e8f0",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            ×
          </button>

          <h2 style={{ fontSize: "2.4rem", fontWeight: "bold", color: "#22d3ee", marginBottom: "1.2rem" }}>
            {planet.project}
          </h2>

          {/* Thumbnails */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {images.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${planet.project} screenshot ${index + 1}`}
                onClick={() => setSelectedIndex(index)}
                style={{
                  width: `${thumbnailWidth}px`,
                  height: `${thumbnailHeight}px`,
                  objectFit: "cover",
                  borderRadius: "0.6rem",
                  cursor: "pointer",
                  border: "2px solid #334155",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.borderColor = "#fbbf24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.borderColor = "#334155";
                }}
              />
            ))}
          </div>

          {/* Description */}
          <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "1.1rem" }}>
            {planet.description}
          </p>
        </div>
      </div>

      {/* Full-screen image viewer */}
      {selectedIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90vh",
            }}
          >
            {images.length > 1 && selectedIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                style={{
                  fontSize: "3rem",
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              >
                ◀
              </button>
            )}

            <img
              src={images[selectedIndex]}
              alt="Full size project screenshot"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "0.8rem",
                boxShadow: "0 0 40px rgba(251,191,36,0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && selectedIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                style={{
                  fontSize: "3rem",
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  marginLeft: "1rem",
                }}
              >
                ▶
              </button>
            )}
          </div>

          <button
            style={{
              position: "absolute",
              top: "2rem",
              right: "4rem",
              fontSize: "3rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setSelectedIndex(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

const Projects: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [isZoomComplete, setIsZoomComplete] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(-1);
  const orbitRef = useRef<THREE.Object3D>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && currentGuideIndex === -1) {
          setCurrentGuideIndex(0);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [currentGuideIndex]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        scrollSnapAlign: "start",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100vh", position: "absolute", inset: 0 }}
        camera={{ position: [80, 60, 80], fov: 50 }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.8} />
        <pointLight position={[0, 5, 0]} intensity={4.5} />

        <Suspense fallback={<Html center style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}>Loading Solar System...</Html>}>
          <SolarSystem
            selectedPlanet={selectedPlanet}
            setSelectedPlanet={setSelectedPlanet}
            setIsZoomComplete={setIsZoomComplete}
            currentGuideIndex={currentGuideIndex}
          />
          <OrbitControls ref={orbitRef as any} enableZoom enablePan={false} />
        </Suspense>
      </Canvas>

      {isZoomComplete && selectedPlanet !== null && (
        <ProjectDetail
          planet={planets[selectedPlanet]}
          onBack={() => {
            setSelectedPlanet(null);
            setIsZoomComplete(false);

            if (selectedPlanet === currentGuideIndex) {
              setCurrentGuideIndex((prev) => {
                const next = prev + 1;
                return next < planets.length ? next : -1;
              });
            }
          }}
        />
      )}
    </section>
  );
};

export default Projects;