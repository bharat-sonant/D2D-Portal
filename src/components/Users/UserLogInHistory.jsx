import React, { useEffect, useState } from "react";
import style from "./loginHistory.module.css";
import calendarStyle from "../../assets/css/User/calender.module.css";
import "./calender.css";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import * as action from "../../Actions/UserAction/calendarAction";
import { images } from "../../assets/css/imagePath";

dayjs.extend(weekOfYear);

const UserLoginHistory = ({ userId, userName, open, onClose }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [daysArray, setDaysArray] = useState([]);

  useEffect(() => {
    if (!userId || !open) return;

    action.getDatesArrayAction(
      setDaysArray,
      currentDate,
      userId
    );
  }, [currentDate, userId, open]);

  const prevMonth = () => {
    action.prevMonthAction(setCurrentDate);
  };

  const nextMonth = () => {
    action.nextMonthAction(setCurrentDate);
  };

  if (!open) return null;

  return (
    <>
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      <div
        className={`offcanvas offcanvas-end show ${style.offcanvas}`}
        tabIndex="-1"
        style={{
          zIndex: 1045,
          display: "flex",
          flexDirection: "column",
          visibility: "visible",
          height: "100vh"
        }}
      >
        <div className={style.offcanvasHeader}>
          <h6 className={style.title}>
           {userName ? ` ${userName}` : ""}
          </h6>
          <button
            type="button"
            className={style.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Calendar Only */}
        <div
          style={{
            padding: "16px",
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            flex: 1,
            overflow: "auto"
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
                            : action.getBackgroundColor(
                                item.status,
                                item.date
                              ),
                          color: item.color,
                          textAlign: "center",
                          fontSize: "11px",
                          padding: "4px",
                          cursor:
                            item.day === "" ||
                            (dayjs(item.date).day() === 0 &&
                              (item.status === 0 || item.status === 7))
                              ? "default"
                              : "pointer"
                        }}
                        className={`date ${
                          item.day === "" ? "empty" : ""
                        } ${
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
      </div>
    </>
  );
};

export default UserLoginHistory;
