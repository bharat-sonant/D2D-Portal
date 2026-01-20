import React, { useEffect, useState } from "react";
import styles from "../../assets/css/Dashboard/WelcomeMsg.module.css";
import { Sun, Moon, Bell } from "lucide-react";

const WelcomeMsg = () => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 16) setGreeting("Good Afternoon");
      else if (hours < 20) setGreeting("Good Evening");
      else setGreeting("Good Night");

      const options = {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      setCurrentDate(`Today is ${now.toLocaleDateString("en-US", options)}`);
    };

    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setUserName(storedUserName);

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getSessionClass = () => {
    if (greeting.includes("Morning")) return styles.morning;
    if (greeting.includes("Afternoon")) return styles.afternoon;
    if (greeting.includes("Evening")) return styles.evening;
    return styles.night;
  };

  // const getSessionIcon = () => {
  //   if (greeting.includes("Night")) return <Moon size={40} />;
  //   // return <Sun size={40} />;
  //   return <span style={{ fontSize: "35px" }}>☀️</span>;
  // };
  const getSessionIcon = () => {
  if (greeting.includes("Morning")) return <span style={{ fontSize: "35px" }}>☀️</span>;
  if (greeting.includes("Afternoon")) return <span style={{ fontSize: "35px" }}>☀️</span>;
  if (greeting.includes("Evening")) return <span style={{ fontSize: "35px" }}>🌤️</span>;
  return <span style={{ fontSize: "35px" }}>🌙</span>;
};

  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.background}>
        <div className={`${styles.gradientOrb} ${styles.orb1}`} />
        <div className={`${styles.gradientOrb} ${styles.orb2}`} />
        <div className={`${styles.gradientOrb} ${styles.orb3}`} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.greetingSection}>
          <div className={styles.greetingLeft}>
            <div className={`${styles.sunIcon} ${getSessionClass()}`}>
              {getSessionIcon()}
            </div>

            <div>
              <p className={styles.hello}>
                Hello, <strong className={styles.bold}> {userName}</strong>
              </p>
              <h1 className={styles.greeting}>{greeting}</h1>
              <p className={styles.date}>{currentDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMsg;
