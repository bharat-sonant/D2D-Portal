
import { Navigate } from "react-router-dom";

const ProtectedRouter = ({ children }) => {
    let isLogin = localStorage.getItem("isLogin");
   
    // let loginDate = localStorage.getItem("loginDate");
    // let todayDate = dayjs().format("DD/MM/YYYY");
    // let isDateMatch = loginDate === todayDate;

    if (isLogin === "success") {
        return children;
    } else {
        return <Navigate to={"/"} />;
    }
}

export default ProtectedRouter
