import React, { useEffect, useState } from "react";
import style from "../../assets/css/User/calender.module.css";
import "./calender.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchUserLoginHistory } from "../../services/UserServices/UserServices";

dayjs.extend(relativeTime);

const Calendar = (props) => {
  const [lastLogin, setLastLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.selectedUser) return;
    fetchLastLogin();
  }, [props.selectedUser]);

  const fetchLastLogin = async () => {
    setLoading(true);
    try {
      const response = await fetchUserLoginHistory(props.selectedUser.id);
      if (response.status === 'success' && response.data && response.data.length > 0) {
        setLastLogin(response.data[0].login_date);
      } else {
        setLastLogin(null);
      }
    } catch (error) {
      console.error("Error fetching login history:", error);
      setLastLogin(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.box}>
      <div className="calendar-container">
        <div className="calendar pb-0 ps-0 pe-0" style={{ minHeight: 'auto' }}>
          <div style={{ marginTop: '8px', display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '15px' }}>
            <h6 style={{ margin: 0 }}>Last Login Day</h6>
            <button onClick={() => props.onHistoryToggle(true)} className="btn view-history-btn">View History</button>
          </div>

          <div style={{ padding: '10px 0 20px 0', textAlign: 'center' }}>
            {/* <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Login Day</p> */}
            {loading ? (
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : lastLogin ? (
              <div>
                <h4 style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                  {dayjs(lastLogin).fromNow()}
                </h4>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  {dayjs(lastLogin).format("dddd, MMMM D, YYYY")}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>No login records found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Calendar);
