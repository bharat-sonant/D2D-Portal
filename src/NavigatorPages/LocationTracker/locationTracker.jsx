// import React, { useEffect, useState } from "react";

// const LocationTracker = () => {
//   const [logs, setLogs] = useState([]);

//   const addLog = (text) => {
//     setLogs((prev) => [...prev, text]);
//   };

//   // ✅ Receive Messages from React Native App
//   useEffect(() => {
//     const listener = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "LOCATION") {
//           addLog(`LIVE → Lat: ${data.payload.latitude}, Lng: ${data.payload.longitude}`);
//         }

//         if (data.type === "LAST_LOC_RETURN") {
//           addLog(`LAST → Lat: ${data.payload.latitude}, Lng: ${data.payload.longitude}`);
//         }
//       } catch (err) {
//         addLog("🚨 Invalid data received from app.");
//       }
//     };

//     window.addEventListener("message", listener);
//     document.addEventListener("message", listener); // (For older Android WebView)

//     return () => {
//       window.removeEventListener("message", listener);
//       document.removeEventListener("message", listener);
//     };
//   }, []);

//   // ✅ Send Message to React Native App
//   const sendToApp = (data) => {
//     window.ReactNativeWebView?.postMessage(JSON.stringify(data));
//   };

//   const requestLastLocation = () => {
//     sendToApp({ type: "REQUEST_LAST_LOC" });
//     addLog("📤 Requested latest saved location...");
//   };

//   const sayHello = () => {
//     sendToApp({ type: "PING", payload: "Hello from Web React!" });
//     addLog("📤 Sent Hello to App.");
//   };

//   return (
//     <div style={styles.container}>
//       <h2>📍 Mobile Live Location</h2>

//       <div style={styles.buttonRow}>
//         <button style={styles.button} onClick={requestLastLocation}>
//           Last Location 
//         </button>

//         <button style={styles.button} onClick={sayHello}>
//           Hello 
//         </button>
//       </div>

//       <div style={styles.logBox}>
//         {logs.map((item, i) => (
//           <div key={i}>{item}</div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LocationTracker;

// const styles = {
//   container: {
//     background: "#111",
//     color: "#fff",
//     padding: "20px",
//     height: "100vh",
//   },
//   buttonRow: {
//     marginBottom: "20px",
//   },
//   button: {
//     background: "#ff6600",
//     border: "none",
//     padding: "10px 16px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     marginRight: "12px",
//     fontSize: "14px",
//   },
//   logBox: {
//     background: "#222",
//     padding: "15px",
//     borderRadius: "8px",
//     height: "60vh",
//     overflowY: "auto",
//     border: "1px solid #444",

//   },
// };


export default function LocationTracker() {
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Welcome to App</h1>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    padding: "0 10px",
    background: "#f2f2f2",
  },
  text: {
    fontSize: "24px",
    textAlign: "center",
    margin: 0,
  },
};
