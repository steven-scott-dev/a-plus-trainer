import React, { useState } from "react";

// Phase modules (you’ll plug these in as you build them)
import Networking from "./phases/Networking";
// placeholders for future phases
// import Hardware from "./phases/Hardware";
// import MobileDevices from "./phases/MobileDevices";
// import Troubleshooting from "./phases/Troubleshooting";
// import Virtualization from "./phases/Virtualization";
// import Security from "./phases/Security";

const PHASES = [
  { id: 1, name: "Networking", component: Networking },
  { id: 2, name: "Hardware", component: null },
  { id: 3, name: "Mobile Devices", component: null },
  { id: 4, name: "Troubleshooting", component: null },
  { id: 5, name: "Virtualization", component: null },
  { id: 6, name: "Security", component: null },
];

export default function App() {
  const [activePhase, setActivePhase] = useState(1);

  const currentPhase = PHASES.find((p) => p.id === activePhase);
  const PhaseComponent = currentPhase?.component;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>CompTIA A+ Core 1 Trainer</h1>
        <p>Select a phase to begin studying</p>
      </header>

      <nav style={styles.nav}>
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            style={{
              ...styles.button,
              background: activePhase === phase.id ? "#2563eb" : "#e5e7eb",
              color: activePhase === phase.id ? "white" : "black",
            }}
          >
            {phase.id}. {phase.name}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {PhaseComponent ? (
          <PhaseComponent />
        ) : (
          <div style={styles.placeholder}>
            <h2>{currentPhase.name}</h2>
            <p>Phase module not connected yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "20px",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  main: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "300px",
  },
  placeholder: {
    textAlign: "center",
    color: "#666",
  },
};
