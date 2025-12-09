import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const VehicleNumber = () => {
  const vehicleNumber = ' SWITCH-EV-1707'
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!vehicleNumber && 'lightgrey'}}>{vehicleNumber || "-"}</h6>
      <label style={{color:!vehicleNumber && 'lightgrey',fontSize:'14px'}} className='text-muted'>Vehicle Number</label>
      </div>
    </div>
  )
}

export default VehicleNumber