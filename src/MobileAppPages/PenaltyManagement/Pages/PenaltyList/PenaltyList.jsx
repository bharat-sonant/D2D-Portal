import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  X,
  Download,
} from "lucide-react";
import styles from '../../Styles/Penalties/PenaltyList.module.css';

const PenaltyList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [penalties, setPenalties] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formattedDate = selectedDate.toISOString().split('T')[0];

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
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      calendarMonth.getMonth() === today.getMonth() &&
      calendarMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() &&
      calendarMonth.getMonth() === selectedDate.getMonth() &&
      calendarMonth.getFullYear() === selectedDate.getFullYear();
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
    <div className={styles.pageWrapper}>
      <div className={styles.mobileView}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backButton}>
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.title}>Penalties</h1>
          <button className={styles.addButton}>
            <Plus size={20} />
            <span>ADD</span>
          </button>
        </div>

        {/* Date Section */}
        <div className={styles.dateSection}>
          <button onClick={() => changeDate(-1)} className={styles.dateNavButton}>
            <ChevronLeft size={20} />
          </button>

          <div className={styles.dateDisplay} onClick={() => setShowCalendar(true)}>
            <Calendar size={18} />
            <span>{formattedDate}</span>
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

        {/* List Container */}
        <div className={styles.listContainer}>
          {penalties.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={64} />
              <p>No entries for this date</p>
            </div>
          ) : (
            penalties.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.employeeName}>{item.employee}</h3>
                  <button className={styles.editButton}>
                    <Pencil size={18} />
                  </button>
                </div>

                <table className={styles.cardTable}>
                  <tbody>
                    <tr>
                      <td>Entry</td>
                      <td>
                        <span className={`${styles.entryValue} ${item.entry === 'Penalty' ? styles.penalty : styles.reward}`}>
                          {item.entry}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>{item.entry === 'Penalty' ? 'Penalty' : 'Reward'}</td>
                      <td>₹{item.amount} | {item.reason} |</td>
                    </tr>
                    <tr>
                      <td>Reason</td>
                      <td>{item.reason}</td>
                    </tr>
                    <tr>
                      <td>{item.entry === 'Reward' ? 'Rewarded by' : 'Penalized by'}</td>
                      <td>{item.penalizedBy}  ({item.time})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>

        {/* Download Button */}
        <button className={styles.downloadBtn}>
          <Download size={20} />
          DOWNLOAD PENALTY/REWARD
        </button>

        {/* Calendar Modal */}
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
      </div>
    </div>
  );
};

export default PenaltyList;