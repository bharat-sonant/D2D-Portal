import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const AppStatus = () => {
  const appStatus = 'Opened';
  const statusClass = appStatus==='Opened'?'text-success':appStatus==='Closed'?'text-danger':'text-muted';
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!appStatus && 'lightgrey'}} className={`${statusClass}`}>{appStatus || "-"}</h6>
      <label style={{color:!appStatus && 'lightgrey',fontSize:'14px'}} className='text-muted'>App Status</label>
      </div>
    </div>
  )
}

export default AppStatus;