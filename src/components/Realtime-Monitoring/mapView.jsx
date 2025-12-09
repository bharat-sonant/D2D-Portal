import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';
import image from '../../assets/images/mapView.png'

const MapView = () => {
  return (
    <div className={`${style.card} d-flex p-2`}>
      <div style={{height:'100%'}}>
        <img src={image} style={{ maxHeight: "100%" }} />
      </div>
    </div>
  );
}
export default MapView;