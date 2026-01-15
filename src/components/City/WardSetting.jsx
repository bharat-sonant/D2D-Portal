import { useEffect, useState } from 'react';
import WardMapCanvas from './WardMapCanvas';
import { updateWardRealTimeStatusAction } from '../../Actions/City/cityAction';

export default function WardSetting(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [openCanvas,setOpenCanvas]=useState(false)
  useEffect(() => {
  if (!props?.selectedWard) {
    setIsEnabled(false);
    return;
  }

  if (props.selectedWard.show_realtime === 'Yes') {
    setIsEnabled(true);
  } else {
    setIsEnabled(false);
  }
}, [props.selectedWard]);


   const handleToggleSwitch=()=>{
       setIsEnabled(!isEnabled)
       updateWardRealTimeStatusAction(props.selectedWard.id, props.selectedWard.show_realtime, props.setWardList,setIsEnabled)
  }

  return (
    <>
     
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .app-container {
        margin-left:-30px
          margin-Top:1px;
          width:100%
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .toggle-card {
        
          background: white;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          padding: 1.5rem;
          max-width: 400px;
          width: 100%;
        }
        
        .toggle-switch {
          position: relative;
          width: 50px;
          height: 26px;
          background-color: #ccc;
          border-radius: 26px;
          cursor: pointer;
          transition: background-color 0.3s;
          border: none;
        }
        
        .toggle-switch.active {
          background-color: #6B7FDE;
        }
        
        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-switch.active .toggle-slider {
          transform: translateX(24px);
        }
        
        .toggle-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
        }
          .heading-lable{
           font-size:15px;
           color:#000000;
           font-family:Graphik-Medium
          }

          .text-lable{
          font-size:13px;
           color:#212121;
           font-family:Graphik-Medium
          }
           
      `}</style>
      
      <div className="app-container">
        <div className="toggle-card">
          <h2 className="mb-4 heading-lable">Ward Setting</h2>
          
          <div className="card bg-light border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1">
                  <p className="toggle-text mb-0 text-lable">
                    {' Show in Realtime'}
                  </p>
                </div>
                
                <button 
                  className={`toggle-switch ${isEnabled ? 'active' : ''}`}
                  onClick={() => handleToggleSwitch()}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
              
            </div>
          </div>
          <div className="card bg-light border-0 mt-3">
  <div className="card-body">
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#212121',
          fontFamily: 'Graphik-Medium'
        }}
      >
        Ward Maps
      </p>

      <button
        onClick={() => {
         setOpenCanvas(true)
        }}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#6B7FDE',
          color: '#fff',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        +
      </button>
    </div>
  </div>
</div>

        </div>
      </div>
        {openCanvas && (
        <WardMapCanvas
          openCanvas={openCanvas}
          setOpenCanvas={setOpenCanvas}
          wardId={props.selectedWard.id}
          selectedCity={props.selectedCity.city_id}
        />
      )}
    </>
  );
}