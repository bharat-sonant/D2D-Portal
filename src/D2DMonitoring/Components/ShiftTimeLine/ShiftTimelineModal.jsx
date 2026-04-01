import React from 'react';
import { Clock, MapPin, UserCircle2, LogIn, LogOut } from 'lucide-react';
import MonitoringModal from '../D2DMonitoring/Common/MonitoringModal/MonitoringModal';
import styles from './ShiftTimelineModal.module.css';

const ShiftTimelineModal = ({
    onClose,
    wardName,
    dutyInTime,
    dutyOutTime,
    wardReachedTime,
    dutyInImage,
    dutyOutImage,
    isLive,
}) => {
    const hasShiftData = Boolean(dutyInTime || wardReachedTime || dutyOutTime || isLive);
    const status = isLive        ? 'Working'
        : dutyOutTime            ? 'Completed'
        : dutyInTime             ? 'On Duty'
        : hasShiftData           ? 'Pending'
        : '--:--';

    const statusCls = isLive    ? styles.statusWorking
        : dutyOutTime           ? styles.statusDone
        : dutyInTime            ? styles.statusOnDuty
        : hasShiftData          ? styles.statusPending
        : styles.infoValFaint;

    return (
        <MonitoringModal
            title="Shift Timeline"
            subtitle={wardName ? `Ward ${wardName}` : undefined}
            icon={<Clock size={18} />}
            onClose={onClose}
            width="sm"
        >
            {/* ── Two punch cards ── */}
            <div className={styles.punchGrid}>

                {/* Punch In card */}
                <div className={styles.punchCard}>
                    <div className={`${styles.punchCardTop} ${styles.punchCardTopIn}`}>
                        <LogIn size={12} />
                        <span>Duty In</span>
                    </div>

                    <div className={styles.punchImgWrap}>
                        {dutyInImage
                            ? <img src={dutyInImage} alt="Duty In" className={styles.punchImg} />
                            : <div className={styles.punchImgEmpty}>
                                <UserCircle2 size={52} strokeWidth={1} />
                              </div>
                        }
                    </div>

                    <div className={`${styles.punchCardBottom} ${styles.punchCardBottomIn}`}>
                        <span className={`${styles.punchTime} ${!dutyInTime ? styles.punchTimeFaint : ''}`}>
                            {dutyInTime || '--:--'}
                        </span>
                    </div>
                </div>

                {/* Punch Out card */}
                <div className={styles.punchCard}>
                    <div className={`${styles.punchCardTop} ${styles.punchCardTopOut}`}>
                        <LogOut size={12} />
                        <span>Duty Out</span>
                    </div>

                    <div className={styles.punchImgWrap}>
                        {dutyOutImage
                            ? <img src={dutyOutImage} alt="Duty Out" className={styles.punchImg} />
                            : <div className={`${styles.punchImgEmpty} ${styles.punchImgEmptyOut}`}>
                                <UserCircle2 size={52} strokeWidth={1} />
                              </div>
                        }
                    </div>

                    <div className={`${styles.punchCardBottom} ${styles.punchCardBottomOut}`}>
                        <span className={`${styles.punchTime} ${isLive ? styles.punchTimeLiveNote : !dutyOutTime ? styles.punchTimeFaint : ''}`}>
                            {isLive ? 'Not Duty Off Yet' : (dutyOutTime || '--:--')}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Info row ── */}
            <div className={styles.infoRow}>
                <div className={styles.infoCard}>
                    <div className={styles.infoIconBox}>
                        <MapPin size={15} />
                    </div>
                    <div className={styles.infoBody}>
                        <p className={styles.infoLabel}>Ward Reached</p>
                        <p className={`${styles.infoVal} ${!wardReachedTime ? styles.infoValFaint : ''}`}>
                            {wardReachedTime || '--:--'}
                        </p>
                    </div>
                </div>

                <div className={styles.infoCard}>
                    <div className={styles.infoIconBox}>
                        <Clock size={15} />
                    </div>
                    <div className={styles.infoBody}>
                        <p className={styles.infoLabel}>Status</p>
                        <div className={styles.statusRow}>
                            <p className={`${styles.infoVal} ${statusCls}`}>{status}</p>
                            {isLive && (
                                <span className={styles.liveBadge}>
                                    <span className={styles.liveBadgeDot} />
                                    Live
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MonitoringModal>
    );
};

export default ShiftTimelineModal;
