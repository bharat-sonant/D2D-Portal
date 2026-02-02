import React, { useEffect, useState } from "react";
import style from "./UserLogInHistory.module.css";
import calendarStyle from "../../assets/css/User/calender.module.css";
import "./calender.css";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import * as action from "../../Actions/UserAction/calendarAction";
import { images } from "../../assets/css/imagePath";

dayjs.extend(weekOfYear);

const UserLoginHistory = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [daysArray, setDaysArray] = useState([]);

  const prevMonth = () => {
    action.prevMonthAction(setCurrentDate);
  };

  const nextMonth = () => {
    action.nextMonthAction(setCurrentDate);
  };

  useEffect(() => {
    if (!userId) return;

    action.getDatesArrayAction(setDaysArray, currentDate, userId);
  }, [currentDate, userId]);
  return (
    <>

      {/* Calendar Only */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
          overflow: "auto",
          borderRadius: "6px",
          border: "1px solid var(--borderColor)",
        }}
      >
        <div
          className={calendarStyle.box}
          style={{ border: "none", boxShadow: "none", padding: 0 }}
        >
          <div className="calendar-container">
            <div className="calendar pb-0 ps-0 pe-0">
              <div className="header33">
                <button
                  onClick={prevMonth}
                  className={`btn ${calendarStyle.PrevBtn}`}
                >
                  <img
                    src={images.iconUp}
                    className={calendarStyle.Icon}
                    alt="Prev"
                  />
                </button>

                <h5 className={calendarStyle.monthHeading}>
                  {currentDate.format("MMMM YYYY")}
                </h5>

                <button
                  onClick={nextMonth}
                  className={`btn ${calendarStyle.PrevBtn}`}
                >
                  <img
                    src={images.iconUp}
                    className={calendarStyle.Icon2}
                    alt="Next"
                  />
                </button>
              </div>

              <div className="days-header">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="day">
                      {day}
                    </div>
                  ),
                )}
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
                      className={`date ${item.day === "" ? "empty" : ""} ${
                        dayjs(item.date).day() === 0
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
      </div>
    </>
  );
};

export default UserLoginHistory;
