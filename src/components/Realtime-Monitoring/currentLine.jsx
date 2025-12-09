import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const CurrentLine = () => {
  const currentLine = '1'
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!currentLine && 'lightgrey'}}>{currentLine || "-"}</h6>
      <label style={{color:!currentLine && 'lightgrey',fontSize:'14px'}} className='text-muted'>Current Line</label>
      </div>
    </div>
  )
}

export default CurrentLine