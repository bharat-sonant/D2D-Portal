import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const VehicleCurrentStatus = () => {
  let status = 'Ward In';
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!status && 'lightgrey'}} className='text-success'>{status || "-"}</h6>
      <label style={{color:!status && 'lightgrey',fontSize:'14px'}} className='text-muted'>Vehicle Current Status</label>
      </div>
    </div>
  )
}

export default VehicleCurrentStatus;