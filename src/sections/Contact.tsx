// Contact.tsx
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

const Contact: React.FC = () => {
  return (
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
          textShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.3)",
        }}
      >
        Contact Me
      </h1>

      {/* Contact Info */}
      <div
        style={{
          zIndex: 2,
          textAlign: "center",
          color: "#d1d5db",
          lineHeight: 2,
        }}
      >
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:heranweyessa61@gmail.com"
            style={{ color: "#22d3ee", textDecoration: "underline" }}
          >
            heranweyessa61@gmail.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong> +251-989013989
        </p>
        <p>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/heran-weyessa-a22170192/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#22d3ee", textDecoration: "underline" }}
          >
            linkedin.com/in/yourprofile
          </a>
        </p>
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
        Let's build something amazing together.
      </p>
    </section>
  );
};

export default Contact;
