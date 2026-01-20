import { useState, useEffect } from "react";
import EmployeeTopbar from "./EmployeeTopbar";
import DefaultCitySelection from "../components/DefaultCitySelection/DefaultCitySelection";

const EmployeeLayout = ({ children }) => {
    const [showDefaultCity, setShowDefaultCity] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!isDesktop) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                textAlign: "center",
                background: "var(--white)",
                fontFamily: "var(--fontGraphikMedium)"
            }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>🖥️</div>
                <h2>Desktop View Required</h2>
                <p style={{ color: "var(--textMuted)", maxWidth: "300px" }}>
                    The Employee Management section is only available on desktop browsers (1024px or wider).
                </p>
            </div>
        );
    }

    return (
        <>
            <EmployeeTopbar setShowDefaultCity={setShowDefaultCity} />
            <div style={{ paddingTop: "60px" }}>
                {children}
            </div>
            {showDefaultCity && (
                <DefaultCitySelection
                    onClose={() => setShowDefaultCity(false)}
                />
            )}
        </>
    );
};

export default EmployeeLayout;
