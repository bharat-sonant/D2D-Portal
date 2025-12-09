import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const DutyOnTime = () => {
  const dutyOntime = '08:24 AM'
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!dutyOntime && 'lightgrey'}}>{dutyOntime || "-:-"}</h6>
      <label style={{color:!dutyOntime && 'lightgrey',fontSize:'14px'}} className='text-muted'>Duty On</label>
      </div>
    </div>
  )
}

export default DutyOnTime;