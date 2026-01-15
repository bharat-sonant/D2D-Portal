import React, { useEffect, useState } from "react";
import style from "./loginHistory.module.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchUserLoginHistory } from "../../services/UserServices/UserServices";
import { LogIn, Clock, Calendar } from "lucide-react";

dayjs.extend(relativeTime);

const UserLoginHistory = ({ userId, open, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            fetchHistory();
        }
    }, [open, userId]);

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
                style={{ zIndex: 1045, display: "block", visibility: "visible" }}
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
                <div className={style.offcanvasBody}>
                    {loading ? (
                        <div className={style.loading}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : history.length > 0 ? (
                        history.map((item, index) => (
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
                                                <Calendar size={12} className={style.smallIcon} />
                                                {dayjs(item.login_date).format("MMMM D, YYYY")}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={style.emptyState}>No login history found</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserLoginHistory;
