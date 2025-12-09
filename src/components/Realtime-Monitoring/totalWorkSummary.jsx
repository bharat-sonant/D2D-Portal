import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const TotalWorkSummary = () => {
    const totalWorkTime = '4 hr 28 Min';
    const totalDistanceCovered = '6.95 Km';
    const avgSpeed = '1.55 Km/Hr';

  return (
    <div className={`${style.card} p-2`}>
      <h6 className="text-muted text-center">Total Work Summary</h6>
      <div className=" d-flex justify-content-between">
        <div className="text-center p-1">
          <h6 style={{ color: !totalWorkTime && "lightgrey" }}>{totalWorkTime || "-"}</h6>
          <label
            style={{ color: !totalWorkTime && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Work time
          </label>
        </div>
        <div className="text-center p-1">
          <h6
            style={{ color: !totalDistanceCovered && "lightgrey" }}
          >
            {totalDistanceCovered || "-"}
          </h6>
          <label
            style={{ color: !totalDistanceCovered && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Distance Covered
          </label>
        </div>
        <div className="text-center p-1">
          <h6
            style={{ color: !avgSpeed && "lightgrey" }}
          >
            {avgSpeed || "-"}
          </h6>
          <label
            style={{ color: !avgSpeed && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Avg. Speed
          </label>
        </div>
      </div>
    </div>
  );
}

export default TotalWorkSummary