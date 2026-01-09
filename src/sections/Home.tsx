// Home.tsx
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const Home: React.FC = () => {
  const imageSize = 190;
  const textMaxWidth = 600;

  return (
    <section
      id="home"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // changed from center
        color: "white",
        scrollSnapAlign: "start",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        paddingTop: "100px", // pushes everything down (adjust if needed)
      }}
    >
      {/* 3D Canvas Background with Stars */}
      <Canvas
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        </Suspense>
        <ambientLight intensity={0.5} />
      </Canvas>

      {/* Centered Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          textAlign: "center",
          zIndex: 3,
          width: "90%",
          maxWidth: `${textMaxWidth}px`,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        }}
      >
        {/* Profile Image */}
        <motion.img
          src="/me.png"
          alt="Profile"
          animate={{
            boxShadow: [
              "0 0 15px rgba(34, 211, 238, 0.4)",
              "0 0 25px rgba(34, 211, 238, 0.8)",
              "0 0 15px rgba(34, 211, 238, 0.4)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: `${imageSize}px`,
            height: `${imageSize * 1.2}px`,
            borderRadius: "50%",
            marginBottom: "0rem",
            border: "2px solid #22d3ee",
            objectFit: "cover",
          }}
        />

        {/* Main Headline */}
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "700",
            color: "#22d3ee",
            marginBottom: "0.4rem",
            marginTop: "0rem",
            textShadow: "0 0 10px rgba(34, 211, 238, 0.4)",
          }}
        >
          Hi, I'm Heran 👋
        </h1>

        {/* Subheading with faster animation + bold text */}
        <TypeAnimation
          sequence={[
            "Full Stack Software Engineer",
            2000,
            "Machine Learning Enthusiast",
            2000,
          ]}
          wrapper="h2"
          speed={35} // slightly faster typing speed
          repeat={Infinity}
          style={{
            fontSize: "1.3rem",
            color: "#e5e7eb",
            marginBottom: "0.6rem",
            marginTop: "0rem",
            fontWeight: "600", // bold text
          }}
        />

        {/* Description */}
        <p
          style={{
            margin: "0 auto",
            textAlign: "center",
            color: "#d1d5db",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginTop: "0rem",
          }}
        >
          I create performant, user-focused digital experiences with clean code
          and creativity. My goal is to craft impactful software that merges
          design, engineering, and intelligence.
        </p>

        {/* Buttons */}
        <div
          style={{
            marginTop: "1.2rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.8rem",
          }}
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#22d3ee",
              color: "#0f172a",
              padding: "0.6rem 1.2rem",
              borderRadius: "9999px",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "0.9rem",
              boxShadow: "0 0 8px rgba(34, 211, 238, 0.3)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#67e8f9")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#22d3ee")
            }
          >
            View My Work
          </motion.a>

          <motion.a
            href="/Heran_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              border: "2px solid #22d3ee",
              color: "#22d3ee",
              padding: "0.6rem 1.2rem",
              borderRadius: "9999px",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "0.9rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(34,211,238,0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Download Resume
          </motion.a>
        </div>

        {/* Scroll Indicator */}
        <motion.p
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            marginTop: "0.8rem",
            fontSize: "0.85rem",
            color: "#94a3b8",
          }}
        >
          ⬇ Scroll Down 6⬇
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Home;
