import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const CardType = () => {
    const commercial = '125';
    const residential = '25';

  return (
    <div className={`${style.card} p-2`}>
      <h6 className="text-muted text-center">Card Type</h6>
      <div className=" d-flex justify-content-between">
        <div className="text-center p-1">
          <h6 style={{ color: !commercial && "lightgrey" }}>{commercial || "0"}</h6>
          <label
            style={{ color: !commercial && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Commercial
          </label>
        </div>
        <div className="text-center p-1">
          <h6
            style={{ color: !residential && "lightgrey" }}
          >
            {residential || "0"}
          </h6>
          <label
            style={{ color: !residential && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Residential
          </label>
        </div>
      </div>
    </div>
  );
}

export default CardType;