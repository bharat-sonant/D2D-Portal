import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const WardReachTime = () => {
  const WardReachTime = '09:15 AM'
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!WardReachTime && 'lightgrey'}}>{WardReachTime || "-:-"}</h6>
      <label style={{color:!WardReachTime && 'lightgrey',fontSize:'14px'}} className='text-muted'>Ward Reach</label>
      </div>
    </div>
  )
}

export default WardReachTime;