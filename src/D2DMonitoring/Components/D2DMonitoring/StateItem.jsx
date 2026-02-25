import styles from '../../Pages/D2DRealtime/Realtime.module.css';

const StateItem = ({ items = [] }) => {
    return (
        <>
            {items.map((item) => (
                <div
                    key={item?.label}
                    className={`${styles.miniStatItem} ${item?.layout === "iconLeft" ? styles.miniStatItemIconLeft : ""}`}
                >
                    {item?.layout === "iconLeft" && item?.icon && <div className={styles.miniStatLeadIcon}>{item.icon}</div>}
                    <div className={styles.miniStatContent}>
                        <div className={styles.miniStatTop}>
                            <div className={styles.miniStatHeader}>
                                {item?.layout !== "iconLeft" && item?.icon && <div style={{ color: "var(--themeColor)" }}>{item.icon}</div>}
                                <span className={styles.miniStatLabel}>{item?.label}</span>
                            </div>
                            <span className={styles.miniStatValue} style={{ color: item?.color }}>{item?.value}</span>
                        </div>
                        {typeof item?.graphPercent === "number" && (
                            item?.graphStyle === "dots" ? (
                                <div className={styles.miniStatDotGraph}>
                                    {Array.from({ length: 10 }).map((_, idx) => (
                                        <span key={idx} className={`${styles.miniStatDot} ${idx < Math.round(item.graphPercent / 10) ? styles.miniStatDotActive : ""}`} style={idx < Math.round(item.graphPercent / 10) ? { background: item?.color || "var(--themeColor)" } : undefined} />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.miniStatGraphTrack}>
                                    <div className={styles.miniStatGraphFill} style={{ width: `${item?.graphPercent}%`, background: item?.color || "var(--themeColor)" }} />
                                </div>
                            )
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default StateItem
