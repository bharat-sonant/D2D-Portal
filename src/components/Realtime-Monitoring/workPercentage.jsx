import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const WorkPercentage = () => {
  const workPercentage = '11%';
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!workPercentage && 'lightgrey'}} >{workPercentage || "-"}</h6>
      <label style={{color:!workPercentage && 'lightgrey',fontSize:'14px'}} className='text-muted'>Work Percentage</label>
      </div>
    </div>
  )
}

export default WorkPercentage;