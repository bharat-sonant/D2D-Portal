import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";

const LoginContext = createContext();

const PUBLIC_ROUTES = ["/", "/:city/d2dMonitoring/monitoring","/:city/d2dMonitoring/daily-work-report"];

export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return;
    }

    const isPublic = PUBLIC_ROUTES.some((pattern) =>
      matchPath(pattern, location.pathname)
    );
    if (isPublic) {
      return;
    }

    const savedDate = localStorage.getItem("loginDate");
    const isLogin = localStorage.getItem("isLogin");
    const today = dayjs().format("DD/MM/YYYY");

    if (!savedDate || isLogin !== "success" || savedDate !== today) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("loginDate");
      localStorage.removeItem("name");
      localStorage.removeItem("userId");
      localStorage.removeItem("city");
      localStorage.removeItem("defaultCity");

      navigate("/", { replace: true });
      return;
    }
  }, [location.pathname]);

  return (
    <LoginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);