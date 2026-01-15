import React, { useEffect, useState } from "react";
import style from "./loginHistory.module.css";
import calendarStyle from "../../assets/css/User/calender.module.css";
import "./calender.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { fetchUserLoginHistory } from "../../services/UserServices/UserServices";
import { LogIn, Clock, Calendar as CalendarIcon } from "lucide-react";
import * as action from "../../Actions/UserAction/calendarAction";
import { images } from "../../assets/css/imagePath";

dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);

const UserLoginHistory = ({ userId, userName, open, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [daysArray, setDaysArray] = useState([]);

    useEffect(() => {
        if (open && userId) {
            fetchHistory();
        }
    }, [open, userId]);

    // Calendar Effect
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

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetchUserLoginHistory(userId);
            if (response.status === 'success') {
                setHistory(response.data || []);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error fetching login history:", error.message);
        } finally {
            setLoading(false);
        }
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
                    <h5 className={style.title}>Login History</h5>
                    <button
                        type="button"
                        className={style.closeBtn}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Fixed Calendar Section */}
                <div style={{
                    padding: '0 16px',
                    background: '#fff',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    flexShrink: 0,
                    zIndex: 10,
                    display: "flex",justifyContent:"center"
                }}>
                    <div className={calendarStyle.box} style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <div className="calendar-container">
                            <div className="calendar pb-0 ps-0 pe-0">
                                <div className="header33">
                                    <button onClick={prevMonth} className={`btn ${calendarStyle.PrevBtn}`}>
                                        <img src={images.iconUp} className={`${calendarStyle.Icon}`} />
                                    </button>
                                    <h5 className={calendarStyle.monthHeading}>
                                        {currentDate.format("MMMM YYYY")}
                                    </h5>
                                    <button onClick={nextMonth} className={`btn ${calendarStyle.PrevBtn}`}>
                                        <img src={images.iconUp} className={`${calendarStyle.Icon2}`} />
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
                </div>

                {/* Scrollable History List */}
                <div className={style.offcanvasBody} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {loading ? (
                        <div className={style.loading}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : history.filter(item => dayjs(item.login_date).isSame(currentDate, 'month')).length > 0 ? (
                        history
                            .filter(item => dayjs(item.login_date).isSame(currentDate, 'month'))
                            .map((item, index) => (
                                <div key={item.id || index} className={style.historyItem}>
                                    <div className={style.iconWrapper}>
                                        <LogIn size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className={style.contentWrapper}>
                                        <div className={style.primaryText}>
                                            {dayjs(item.login_date).fromNow()}
                                        </div>
                                        <div className={style.secondaryText}>
                                            {dayjs(item.login_date).isSame(dayjs(), 'day') ? (
                                                <>
                                                    <Clock size={12} className={style.smallIcon} />
                                                    {dayjs(item.login_date).format("h:mm A")}
                                                </>
                                            ) : (
                                                <>
                                                    <CalendarIcon size={12} className={style.smallIcon} />
                                                    {dayjs(item.login_date).format("MMMM D, YYYY")}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className={style.emptyState}>No login history found for {currentDate.format("MMMM YYYY")}</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserLoginHistory;
