// Experience.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

const cardStyle: React.CSSProperties = {
  minWidth: "280px",
  maxWidth: "280px",
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(34, 211, 238, 0.3)",
  borderRadius: "16px",
  padding: "1.4rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.1)",
  transition: "all 0.3s ease",
  scrollSnapAlign: "start",
};

const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "white",
        scrollSnapAlign: "start",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 0",
      }}
    >
      {/* Background Canvas */}
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#22d3ee" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
        </Suspense>
      </Canvas>

      {/* Title */}
      <h1
        style={{
          fontSize: "2.8rem",
          fontWeight: "bold",
          color: "#22d3ee",
          textAlign: "center",
          marginBottom: "2rem",
          zIndex: 2,
          textShadow:
            "0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)",
        }}
      >
        Experience
      </h1>

      {/* Horizontal Scroll Container */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          padding: "0 2rem",
          zIndex: 2,
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* EduJoy */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Founding Full Stack Developer
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "0.6rem" }}>
            <strong>EduJoy</strong> • 2025 – Present
          </p>
          <p style={{ lineHeight: 1.55 }}>
            Launched an <strong>inclusive edtech startup</strong> using{" "}
            <strong>Node.js</strong> + <strong>Flutter</strong> to deliver animated,
            sign-language-enabled lessons for children with disabilities in Ethiopia.
          </p>
        </div>

        {/* MESOB */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Full Stack Engineer
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "0.6rem" }}>
            <strong>MESOB</strong> • Oct 2024 – Apr 2025
          </p>
          <p>
            Built a <strong>real-time queue system</strong> in Node.js, reducing
            wait times by <strong>50%</strong>. Designed a TypeScript document portal
            for multi-org submissions.
          </p>
        </div>

        {/* Kifiya */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Mobile AI Developer (Intern)
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "0.6rem" }}>
            <strong>Kifiya</strong> • Jun – Sep 2024
          </p>
          <p>
            Developed a <strong>Flutter app</strong> with AI image recognition to audit
            supermarket planograms and generate compliance analytics.
          </p>
        </div>

        {/* Ethiopian AI Institute */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
                Cyber Security Engineer
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "0.6rem" }}>
            <strong>Ethiopian Artificial Intelligence Institute</strong>
          </p>
          <p>
       
Worked as a Cyber Security Engineer conducting authorized penetration testing and ethical hacking on multiple government web platforms. Identified security vulnerabilities, assessed system weaknesses, and provided actionable remediation recommendations to strengthen infrastructure security, improve resilience against cyber threats, and ensure compliance with national security standards.
          </p>
        </div>

        {/* A2SV */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "1.3rem", marginBottom: "0.4rem" }}>
            Head of GDG
          </h3>
          <p style={{ color: "#94a3b8", marginBottom: "0.6rem" }}>
            <strong>GDG</strong> • Dec 2023 – Apr 2024
          </p>
          <p>
            Led DSA training for <strong>100+ students</strong>, preparing them for
            interviews at <strong>Google, Meta, Amazon</strong>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: "2rem",
          fontSize: "0.85rem",
          color: "#64748b",
          textAlign: "center",
          zIndex: 2,
          fontStyle: "italic",
        }}
      >
        Building the future, one line of code at a time.
      </p>
    </section>
  );
};

export default Experience;
