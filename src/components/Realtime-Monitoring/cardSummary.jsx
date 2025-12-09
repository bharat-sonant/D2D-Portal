import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const CardSummary = () => {
    const totalCards = '125';
    const scannedCards = '25';
    const scannedPercentage = '20%';

  return (
    <div className={`${style.card} p-2`}>
      <h6 className="text-muted text-center">Card Summary</h6>
      <div className=" d-flex justify-content-between">
        <div className="text-center p-1">
          <h6 style={{ color: !totalCards && "lightgrey" }}>{totalCards || "0"}</h6>
          <label
            style={{ color: !totalCards && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Total Cards
          </label>
        </div>
        <div className="text-center p-1">
          <h6
            style={{ color: !scannedCards && "lightgrey" }}
          >
            {scannedCards || "0"}
          </h6>
          <label
            style={{ color: !scannedCards && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Scanned Cards
          </label>
        </div>
        <div className="text-center p-1">
          <h6 style={{ color: !scannedPercentage && "lightgrey" }} className='text-danger' >
            {scannedPercentage || "-"}
          </h6>
          <label
            style={{ color: !scannedPercentage && "lightgrey", fontSize: "14px" }}
            className="text-muted"
          >
            Percentage
          </label>
        </div>
      </div>
    </div>
  );
}
export default CardSummary;