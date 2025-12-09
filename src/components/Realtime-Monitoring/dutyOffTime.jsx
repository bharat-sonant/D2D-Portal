import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const DutyOffTime = () => {
  const dutyOfftime = '05:48 PM'
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!dutyOfftime && 'lightgrey'}}>{dutyOfftime || "-:-"}</h6>
      <label style={{color:!dutyOfftime && 'lightgrey',fontSize:'14px'}} className='text-muted'>Duty Off</label>
      </div>
    </div>
  )
}

export default DutyOffTime;