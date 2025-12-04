import React, { useEffect, useState } from "react";
import styles from "../../assets/css/Dashboard/WelcomeMsg.module.css";
import { images } from "../../assets/css/imagePath";

const WelcomeMsg = () => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [sessionImage, setSessionImage] = useState(images.iconSunrise); // Default image
  const [sessionClass, setSessionClass] = useState(styles.morningTheme); // Default class
  const [userName, setUserName] = useState("User"); // Default user name

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();

      // Greeting, Image & Class logic
      if (hours >= 0 && hours < 12) {
        setGreeting("Good Morning");
        setSessionImage(images.iconSunrise);
        setSessionClass(styles.morningTheme);
      } else if (hours >= 12 && hours < 16) {
        setGreeting("Good Afternoon");
        setSessionImage(images.iconSunShine);
        setSessionClass(styles.afternoonTheme);
      } else if (hours >= 16 && hours < 20) {
        setGreeting("Good Evening");
        setSessionImage(images.iconSunSet);
        setSessionClass(styles.eveningTheme);
      } else {
        setGreeting("Good Night");
        setSessionImage(images.iconNight);
        setSessionClass(styles.nightTheme);
      }

      // Date formatting
      const options = {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      };
      setCurrentDate(`Today is ${now.toLocaleDateString("en-US", options)}`);
    };

    // Fetch logged-in user name from local storage
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    updateDateTime(); // Run initially
    const timer = setInterval(updateDateTime, 1000); // ✅ Now updating every second

    return () => clearInterval(timer); // Cleanup interval
  }, []);

  return (
    <div className={`${styles.welcomeBox} `}>
      <div className={`${styles.welcomeView}`}>
        <div className={`${styles.welcomeLeft}`}>
          <div className={`${styles.welcomeName}`}>
            Hello,<div className={`${styles.textDark}`}>&nbsp; {userName}</div>
          </div>
          <div className={`${styles.sessionFormat}`}>{greeting}</div>
          <div className={`${styles.date}`}>{currentDate}</div>
        </div>

        <div className={`${styles.welcomeRight}`}>
          <img
            src={sessionImage}
            className={`${styles.imgDayView} ${sessionClass}`}
            alt={greeting}
            title={greeting}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeMsg;
