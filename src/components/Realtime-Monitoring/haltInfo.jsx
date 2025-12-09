import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';
const HaltInfo = () => {
  const total = '08:22';
  const current = '02:00';
  return (
    <div className={`${style.card} p-2`}>
      <h6 className="text-muted text-center">Halt Summary</h6>
      <div className=" d-flex justify-content-between">
        <div className="text-center p-1">
          <h6 style={{ color: !total && "lightgrey" }}>{total || "-:-"}</h6>
          <label
            style={{ color: !total && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Total
          </label>
        </div>
        <div className="text-center p-1">
          <h6
            style={{ color: !current && "lightgrey" }}
            className="text-danger"
          >
            {current || "-:-"}
          </h6>
          <label
            style={{ color: !current && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Current
          </label>
        </div>
      </div>
    </div>
  );
}

export default HaltInfo;