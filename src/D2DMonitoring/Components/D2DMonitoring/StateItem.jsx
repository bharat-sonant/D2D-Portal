import styles from '../../Pages/D2DRealtime/Realtime.module.css';
import progressStyles from '../../Style/StateItem/StateItem.module.css';

const StateItem = ({ items = [] }) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <>
            {safeItems.map((item, index) => {
                const hasExplicitPercentText = item?.percentText !== undefined && item?.percentText !== null;
                const normalizedPercentText = hasExplicitPercentText ? String(item?.percentText).trim() : "";
                const isPercentNumeric = normalizedPercentText !== "" && !Number.isNaN(Number(normalizedPercentText));
                const showPercentSymbol = hasExplicitPercentText ? isPercentNumeric : true;

                return (
                <div
                    key={`${item?.label || "item"}-${index}`}
                    className={`${styles.miniStatItem} ${item?.layout === "iconLeft" ? styles.miniStatItemIconLeft : ""} ${item?.variant === "coverageProgress" ? progressStyles.coverageCard : ""}`}
                >
                    {item?.variant === "coverageProgress" ? (
                        <div className={progressStyles.coverageWrap}>
                            <div className={progressStyles.coverageHead}>
                                <span className={progressStyles.liveTag}>{item?.liveTag || "LIVE TRACKING"}</span>
                                <div className={progressStyles.percentWrap}>
                                    <span className={progressStyles.percentValue}>{item?.percentText ?? Math.round(item?.graphPercent || 0)}</span>
                                    {showPercentSymbol && <span className={progressStyles.percentSymbol}>%</span>}
                                </div>
                            </div>

                            <div className={progressStyles.metaRow}>
                                <div className={progressStyles.metric}>
                                    <span className={progressStyles.metricLabel}>{item?.totalLabel || "TOTAL LENGTH"}</span>
                                    <span className={progressStyles.metricValue}>{item?.totalValue || item?.value || "--"}</span>
                                </div>
                                <div className={`${progressStyles.metric} ${progressStyles.metricRight}`}>
                                    <span className={progressStyles.metricLabel}>{item?.completedLabel || "COMPLETED"}</span>
                                    <span className={progressStyles.metricValue} style={{ color: item?.color || "#3f5efb" }}>{item?.completedValue || "--"}</span>
                                </div>
                            </div>

                            <div className={progressStyles.track}>
                                <div className={progressStyles.fill} style={{ width: `${Math.max(0, Math.min(100, Number(item?.graphPercent) || 0))}%` }} />
                            </div>

                            <div className={progressStyles.remainingText}>Remaining : {item?.remainingValue || "--"}</div>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
                );
            })}
        </>
    );
};

export default StateItem
