import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    Pencil,
    X,
} from "lucide-react";
import styles from '../../Styles/Penalties/PenaltyList.module.css';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const PenaltyList = (props) => {
    const [penalties, setPenalties] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const navigate = useNavigate();

    const handleBack = () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid && window.AndroidApp && typeof window.AndroidApp.closeWebView === "function") {
            window.AndroidApp.closeWebView();
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                employee: "Driver 1 - bharat (104)",
                entry: "Penalty",
                amount: 50,
                reason: "Alcohol consumption in working hours",
                penalizedBy: "Bharat",
                time: "12:13",
            },
            {
                id: 2,
                employee: "Helper 1 - bharat (105)",
                entry: "Reward",
                amount: 50,
                reason: "Uniform wear",
                penalizedBy: "Bharat",
                time: "12:14",
            },
            {
                id: 3,
                employee: "Khushwant sharma -driver (111)",
                entry: "Penalty",
                amount: 50,
                reason: "Absent + Penalty",
                penalizedBy: "Bharat",
                time: "09:26",
            },
            {
                id: 4,
                employee: "Khushwant sharma -helper (112)",
                entry: "Reward",
                amount: 100,
                reason: "Citizen Feedback",
                penalizedBy: "Bharat",
                time: "09:27",
            },
        ];
        setPenalties(dummyData);
    }, []);

    const changeDate = (days) => {
        const newDate = new Date(props.selectedDate);
        newDate.setDate(newDate.getDate() + days);
        props.setSelectedDate(newDate);
    };

    const formattedDate = props.selectedDate.toISOString().split('T')[0];

    const penaltyCount = penalties.filter((p) => p.entry === "Penalty").length;
    const rewardCount = penalties.filter((p) => p.entry === "Reward").length;

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const changeMonth = (direction) => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        setCalendarMonth(newMonth);
    };

    const selectDate = (day) => {
        const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
        props.setSelectedDate(newDate);
        setShowCalendar(false);
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            calendarMonth.getMonth() === today.getMonth() &&
            calendarMonth.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        return day === props.selectedDate.getDate() &&
            calendarMonth.getMonth() === props.selectedDate.getMonth() &&
            calendarMonth.getFullYear() === props.selectedDate.getFullYear();
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek } = getDaysInMonth(calendarMonth);
        const days = [];
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.empty}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayClasses = [
                styles.calendarDay,
                isToday(day) ? styles.today : '',
                isSelected(day) ? styles.selected : ''
            ].filter(Boolean).join(' ');

            days.push(
                <div
                    key={day}
                    className={dayClasses}
                    onClick={() => selectDate(day)}
                >
                    {day}
                </div>
            );
        }

        return (
            <>
                <div className={styles.calendarWeekDays}>
                    {weekDays.map(day => (
                        <div key={day} className={styles.weekDay}>{day}</div>
                    ))}
                </div>
                <div className={styles.calendarGrid}>{days}</div>
            </>
        );
    };

    return (
        <>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <ArrowLeft size={22} />
                </button>
                <h1 className={styles.title}>Penalties</h1>
            </div>
            {/* Floating Add Button for mobile */}
            <button
                className={styles.floatingAddButton}
                onClick={props.onAddClick}
            >
                <Plus size={24} />
            </button>


            {/* Date Section */}
            <div className={styles.dateSection}>
                <button onClick={() => changeDate(-1)} className={styles.dateNavButton}>
                    <ChevronLeft size={20} />
                </button>

                <div className={styles.dateDisplay} onClick={() => setShowCalendar(true)}>
                    <Calendar size={18} />
                    <span>{dayjs(formattedDate).format('DD-MMM-YYYY')}</span>
                </div>

                <button onClick={() => changeDate(1)} className={styles.dateNavButton}>
                    <ChevronRight size={20} />
                </button>

                <div className={styles.summaryBox}>
                    <div className={styles.summaryItem}>
                        <p>Penalty</p>
                        <span>{penaltyCount}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <p>Reward</p>
                        <span>{rewardCount}</span>
                    </div>
                </div>
            </div>

            <div className={styles.listContainer}>
                {props.penaltiesData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Calendar size={64} />
                        <p>No entries for this date</p>
                    </div>
                ) : (
                    props.penaltiesData.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.employeeName}>{item.employeeName}{' '}({item.employeeId})</h3>
                                <button className={styles.editButton}>
                                    <Pencil size={18} />
                                </button>
                            </div>

                            <table className={styles.cardTable}>
                                <tbody>
                                    <tr>
                                        <td>Entry</td>
                                        <td>
                                            <span className={`${styles.entryValue} ${item.entryType === 'Penalty' ? styles.penalty : styles.reward}`}>
                                                {item.entryType}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{item.entryType === 'Penalty' ? 'Penalty' : 'Reward'}</td>
                                        <td>
                                            ₹{item.amount}
                                            {" | "}
                                            {item.penaltyType && `${item.penaltyType}`}
                                            {item.penaltyType && item.rewardType && " | "}
                                            {item.rewardType && `${item.rewardType}`}
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>Reason</td>
                                        <td>{item.reason}</td>
                                    </tr>
                                    <tr>
                                        <td>{item.entryType === 'Reward' ? 'Rewarded by' : 'Penalized by'}</td>
                                        <td>{item.created_By || item.createdBy}  (
                                            {dayjs(item.createdOn || item.created_On).format("hh:mm A")}
                                            )</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>

            {showCalendar && (
                <div className={styles.calendarOverlay} onClick={() => setShowCalendar(false)}>
                    <div className={styles.calendarModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.calendarHeader}>
                            <h2 className={styles.calendarTitle}>Select Date</h2>
                            <button className={styles.closeButton} onClick={() => setShowCalendar(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.calendarNav}>
                            <button className={styles.monthButton} onClick={() => changeMonth(-1)}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className={styles.monthDisplay}>
                                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <button className={styles.monthButton} onClick={() => changeMonth(1)}>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {renderCalendar()}
                    </div>
                </div>
            )}
        </>
    );
};

export default PenaltyList;