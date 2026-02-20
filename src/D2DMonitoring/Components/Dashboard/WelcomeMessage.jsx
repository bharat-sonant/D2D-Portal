import * as action from '../../Action/Dashboard/WelcomeMessageAction';
import styles from '../../../assets/css/Dashboard/WelcomeMsg.module.css';
import { useEffect, useState } from 'react';

const WelcomeMessage = () => {
    const [greeting, setGreeting] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const storedUserName = localStorage.getItem("name");
        if (storedUserName) setUserName(storedUserName);

        action.updateDateTime(setGreeting, setCurrentDate);
        const timer = setInterval(action.updateDateTime(setGreeting, setCurrentDate), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`} />
                <div className={`${styles.gradientOrb} ${styles.orb2}`} />
                <div className={`${styles.gradientOrb} ${styles.orb3}`} />
                <div className={styles.gridOverlay} />
            </div>
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
            <div className={styles.content}>
                <div className={styles.greetingSection}>
                    <div className={styles.greetingLeft}>
                        <div >
                            <p className={styles.hello} style={{ fontSize: '15px' }}>
                                <strong className={styles.bold}>{greeting}</strong>, {userName}
                            </p>
                            <p className={styles.date} style={{ fontSize: '14px' }} >{currentDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeMessage