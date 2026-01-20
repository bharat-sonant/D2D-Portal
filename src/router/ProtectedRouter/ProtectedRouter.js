import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
    let isLogin = localStorage.getItem("isLogin");

    if (isLogin === "success") {
        return children;
    } else {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        return <Navigate to={isMobile ? "/login" : "/"} replace />;
    }
}

export default ProtectedRouter;