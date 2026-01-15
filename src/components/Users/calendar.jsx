import React, { useEffect, useRef, useState } from "react";
import UserLoginHistory from "./UserLogInHistory";
import style from "../../assets/css/User/calender.module.css";
import "./calender.css";
import weekOfYear from "dayjs/plugin/weekOfYear";
import dayjs from "dayjs";
import * as action from "../../Actions/UserAction/calendarAction";
import { images } from "../../assets/css/imagePath";

dayjs.extend(weekOfYear);

const Calendar = (props) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [daysArray, setDaysArray] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const prevMonth = () => {
    action.prevMonthAction(setCurrentDate);
  };

  const nextMonth = () => {
    action.nextMonthAction(setCurrentDate);
  };

  useEffect(() => {
    if (!props.selectedUser) return;
    action.getDatesArrayAction(
      setDaysArray,
      currentDate,
      props.selectedUser.id
    );
  }, [currentDate, props.selectedUser]);

  useEffect(() => {
    if (props.onHistoryToggle) {
      props.onHistoryToggle(showHistory);
    }
  }, [showHistory, props.onHistoryToggle]);

  return (
    <>
      {/* <div className={style.boxHeader}></div> */}

      <div className={style.box}>
        <div className="calendar-container">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 style={{ marginTop: "8px", marginBottom: "0" }}>Login History</h6>
            <button
              className="btn view-history-btn"
              onClick={() => setShowHistory(true)}
            >
              View History
            </button>
          </div>

          <div className="calendar pb-0 ps-0 pe-0">
            <div className="header33">
              <button onClick={prevMonth} className={`btn ${style.PrevBtn}`}>
                <img src={images.iconUp} className={`${style.Icon}`} />
              </button>
              <h5 className={style.monthHeading}>
                {currentDate.format("MMMM YYYY")}
              </h5>
              <button onClick={nextMonth} className={`btn ${style.PrevBtn}`}>
                <img src={images.iconUp} className={`${style.Icon2}`} />
              </button>
            </div>
            <div className="days-header">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="day">
                  {day}
                </div>
              ))}
            </div>
            <div className="days">
              {daysArray.map((item, index) => {
                const isHoliday = item.day === "H";
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: isHoliday
                        ? "rgb(232, 232, 232)"
                        : action.getBackgroundColor(item.status, item.date),
                      color: item.color,
                      textAlign: "center",
                      fontSize: "11px",
                      padding: "4px",
                      cursor:
                        item.day === "" ||
                          (dayjs(item.date).day() === 0 &&
                            (item.status === 0 || item.status === 7))
                          ? "default"
                          : "pointer",
                    }}
                    className={`date ${item.day === "" ? "empty" : ""} ${dayjs(item.date).day() === 0
                      ? "disable"
                      : "cursor-pointer"
                      }`}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>



      <UserLoginHistory
        userId={props.selectedUser?.id}
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </>
  );
};

export default React.memo(Calendar);
