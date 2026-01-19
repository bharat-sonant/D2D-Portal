import React, { useEffect, useState } from "react";
import style from "./calendar.module.css";
import "./calender.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getUserData } from "../../services/UserServices/UserServices";
import { ChevronRight } from "lucide-react";
import { images } from "../../assets/css/imagePath";
import NoResult from "../NoResultFound/NoResult";
import userNotFound from "../../assets/images/icons/cityNotFound.gif";
import WevoisLoader from "../Common/Loader/WevoisLoader";

dayjs.extend(relativeTime);

const Calendar = (props) => {
  const [userLastLogin, setUserLastLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.selectedUser?.id) return;
    fetchLastLogin();
  }, [props.selectedUser]);

  const fetchLastLogin = async () => {
    setLoading(true);
    try {
      const response = await getUserData();

      if (response.status === "success") {
        const selectedUserData = response.data.find(
          (user) => user.id === props.selectedUser.id
        );

        setUserLastLogin(selectedUserData?.last_login_at || null);
      } else {
        setUserLastLogin(null);
      }
    } catch (error) {
      console.error("Error fetching user last login:", error);
      setUserLastLogin(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.lastLoginBox}>
      <div className={style.lastLoginHeader}>
        Last Login
        <button
          onClick={() => props.onHistoryToggle(true)}
          className={style.viewhistoryBtn}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className={style.boxBody}>
        {loading ? (
          <WevoisLoader title={"loading"} height="100px" />
        ) : userLastLogin ? (
          <>
            <img src={images.timeManagement} className={style.loginImg} />
            <h4 className={style.loginTitle}>
              {dayjs(userLastLogin).fromNow()}
            </h4>
            <div className={style.loginTime}>
              {dayjs(userLastLogin).format("D, MMMM YYYY, dddd")}
            </div>
          </>
        ) : (
          <NoResult title=" No login records found" gif={userNotFound} />
        )}
      </div>
    </div>
  );
};

export default React.memo(Calendar);
