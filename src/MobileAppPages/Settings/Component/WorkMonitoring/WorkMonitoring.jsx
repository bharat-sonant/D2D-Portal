import style from "../../Style/Settings.module.css"
import { toggleWorkMonitoring } from "../../Action/WorkMonitoring/WorkMonitoringAction";
const WorkMonitoring = (props) => {
  return (
    <div>
      <div className={style.card}>
        {/* <h3 className={style.cardTitle}>Work Monitoring via Web</h3> */}
        <div className={style.toggleWrapper}>
          <label className={style.toggleLabel}>Work Monitoring Via Web</label>
          <div className={`${style.toggleSwitch} ${props.isWorkMonitoringOn ? style.on : style.off}`} onClick={() => toggleWorkMonitoring(props)}>
            <div className={style.toggleCircle}>{props.isWorkMonitoringOn ? "ON" : "OFF"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkMonitoring
