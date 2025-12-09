import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';
import image from '../../assets/images/imgComingSoon.png'

const HelperInfo = () => {
  return (
    <div className={`${style.card} d-flex p-2`}>
      <div style={{ width: "30%", height: "100px" }}>
        <img src={image} style={{ maxHeight: "100%" }} />
      </div>
      <div>
        <h6 className="mb-2">Helper</h6>
        <p>Anil Sharma</p>
        <p>82786444699</p>
      </div>
    </div>
  );
}

export default HelperInfo