import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const OtherDuty = () => {
  const total = 5;
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!total && 'lightgrey'}} className='text-success'>{total || "0"}</h6>
      <label style={{color:!total && 'lightgrey',fontSize:'14px'}} className='text-muted'>Other Duty</label>
      </div>
    </div>
  )
}

export default OtherDuty;