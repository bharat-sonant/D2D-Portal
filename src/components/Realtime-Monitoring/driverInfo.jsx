import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';
import image from '../../assets/images/wevois-logo.png'

const DriverInfo = () => {
  return (
    <div className={`${style.card} d-flex p-2`}>
      <div style={{ width: "30%", height: "100px" }}>
        <img src={image} style={{ maxHeight: "100%" }} />
      </div>
      <div>
        <h6 className="mb-2">Driver</h6>
        <p>Prashant Meena</p>
        <p>9352509884</p>
      </div>
    </div>
  );
}

export default DriverInfo