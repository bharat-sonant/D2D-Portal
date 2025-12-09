import style from '../../Style/Realtime-Monitoring/realtime-monitoring.style.module.css';

const TripCounts = () => {
  const trips = 11;
  return (
    <div className={`${style.card} d-flex justify-content-center p-2`}>
      <div className='text-center p-1'>
      <h6 style={{color:!trips && 'lightgrey'}} className='text-success'>{trips || "0"}</h6>
      <label style={{color:!trips && 'lightgrey',fontSize:'14px'}} className='text-muted'>Trips</label>
      </div>
    </div>
  )
}

export default TripCounts;