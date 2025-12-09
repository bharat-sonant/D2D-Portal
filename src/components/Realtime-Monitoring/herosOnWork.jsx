import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const HerosOnWork = () => {
  const total = 11;
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!total && 'lightgrey'}} className='text-success'>{total || "0"}</h6>
      <label style={{color:!total && 'lightgrey',fontSize:'14px'}} className='text-muted'>Heros On Work</label>
      </div>
    </div>
  )
}

export default HerosOnWork;