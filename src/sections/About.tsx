// About.tsx
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

const About: React.FC = () => {
  return (
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
        position: "relative",
        zIndex: 1,
        padding: "2rem",
      }}
    >
      {/* Background Canvas */}
      <Canvas
        style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1 }}
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
          fontSize: "2.5rem",
          color: "#22d3ee",
          zIndex: 2,
          marginBottom: "2rem",
          textAlign: "center",
          textShadow:
            "0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3)",
        }}
      >
        About Me
      </h1>

      {/* About Paragraph */}
      <div
        style={{
          maxWidth: "800px",
          zIndex: 2,
          textAlign: "center",
          fontSize: "1.1rem",
          lineHeight: 1.6,
          color: "#d1d5db",
        }}
      >
        <p>
          I'm <strong>Heran Weyessa</strong>, a passionate Full Stack Software Engineer
          from Addis Ababa, Ethiopia. Over the past 6 years, I have built diverse
          solutions in web and mobile development, AI and machine learning, and cybersecurity.
        </p>

        <p>
          I have founded <strong>EduJoy</strong>, an inclusive edtech startup delivering
          sign-language-enabled lessons, worked as a Full Stack Engineer at <strong>MESOB</strong>
          building real-time queue systems, and developed AI-powered mobile applications
          at <strong>Kifiya</strong> for planogram audits. I also served as a Cyber Security Engineer
          at the <strong>Ethiopian Artificial Intelligence Institute</strong>, performing authorized
          penetration testing and ethical hacking on government web systems to enhance
          digital security.
        </p>

        <p>
          I am proficient in <strong>Node.js, Flutter, TypeScript, Python, C++, Java,</strong> and
          <strong> web technologies</strong> including HTML, CSS, and JavaScript. I am committed
          to creating innovative, user-focused solutions that solve real-world problems,
          improve accessibility, and advance technology in Ethiopia.
        </p>

        <p>
          When I'm not coding, I enjoy mentoring students, contributing to tech communities,
          and exploring new AI and cybersecurity advancements to stay at the forefront
          of technology.
        </p>

        <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
          "Building the future, one line of code at a time."
        </p>
      </div>
    </section>
  );
};

export default About;
