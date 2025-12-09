import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const LineSummary = () => {
  const total = '8';
  const completed = '5';
  const skipped  = '3';
  return (
    <div className={`${style.card} p-2`}>
        <h6 className='text-muted text-center'>Line Summary</h6>
        <div className=' d-flex justify-content-between'>

      
      <div className='text-center p-1'>
      <h6 style={{color:!total && 'lightgrey'}}>{total || "0"}</h6>
      <label style={{color:!total && 'lightgrey',fontSize:'14px'}} className='text-muted'>Total</label>
      </div>
      <div className='text-center p-1'>
      <h6 style={{color:!completed && 'lightgrey'}} className='text-success'>{completed || "0"}</h6>
      <label style={{color:!completed && 'lightgrey',fontSize:'14px'}} className='text-muted'>Completed</label>
      </div>
      <div className='text-center p-1'>
      <h6 style={{color:!skipped && 'lightgrey'}} className='text-danger'>{skipped || "0"}</h6>
      <label style={{color:!skipped && 'lightgrey',fontSize:'14px'}} className='text-muted'>Skipped</label>
      </div >
    </div>
      </div>
  );
}
export default LineSummary;