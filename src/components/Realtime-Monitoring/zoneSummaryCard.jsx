import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';
const ZoneSummaryCard = () => {
  const total = '8';
  const completed = '1';
  const active  = '3';
  const inactive = '1';
  const stop = '3'
  return (
    <div className={`${style.card} p-2`}>
       <h6 className='text-muted text-center'>Zone Summary</h6>
        <div className=' d-flex justify-content-between'>
      <div className='text-center p-1'>
      <h6 style={{color:!total && 'lightgrey'}}>{total || "0"}</h6>
      <label style={{color:!total && 'lightgrey',fontSize:'14px'}} className='text-muted'>Total</label>
      </div>
      <div className='text-center p-1'>
      <h6 style={{color:!completed && 'lightgrey'}} className='text-primary'>{completed || "0"}</h6>
      <label style={{color:!completed && 'lightgrey',fontSize:'14px'}} className='text-muted'>Completed</label>
      </div>
      <div className='text-center p-1'>
      <h6 style={{color:!active && 'lightgrey'}} className='text-success'>{active || "0"}</h6>
      <label style={{color:!active && 'lightgrey',fontSize:'14px'}} className='text-muted'>Active</label>
      </div >
      <div className='text-center p-1'>
      <h6 style={{color:!inactive && 'lightgrey'}} className='text-danger'>{inactive || "0"}</h6>
      <label style={{color:!inactive && 'lightgrey',fontSize:'14px'}} className='text-muted'>Inactive</label>
      </div >
      <div className='text-center p-1'>
      <h6 style={{color:!stop && 'lightgrey'}}>{stop || "0"}</h6>
      <label style={{color:!stop && 'lightgrey',fontSize:'14px'}} className='text-muted'>Stop</label>
      </div>
      </div>
    </div>
  );
}

export default ZoneSummaryCard;