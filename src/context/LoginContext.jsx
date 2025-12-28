import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLogin,setIsLogin]=useState(false);  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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