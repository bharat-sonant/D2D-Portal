import  { useState } from 'react';
import {CURRENT_VERSION, newUpdateNotification } from '../../assets/PermissionAlertMessage/Message';

const NewUpdateAlertWindow = (props) => {
  const [updateData] = useState({
    version: "1",
    title: "Exciting New Features Available!",
    description: "We've added some amazing new features and improvements to enhance your experience. Update now to enjoy the latest enhancements!",
  });

 
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1050,
    backdropFilter: 'blur(3px)'
  };

  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1051,
    width: '90%',
    maxWidth: '800px',
    animation: 'slideIn 0.3s ease-out'
  };

  const gradientHeaderStyle = {
    background: 'linear-gradient(135deg, #3fb2f1 0%,rgb(63, 178, 241,1) 100%)',
    borderRadius: '15px 15px 0 0'
  };

  const cardStyle = {
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '15px'
  };

  const versionBadgeStyle = {
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    color: '#8b4513'
  };

  return (
    <>
      {/* CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        .feature-item {
          transition: all 0.2s ease;
        }
        
        .feature-item:hover {
          background-color: #f8f9fa;
          border-radius: 8px;
          transform: translateX(5px);
        }
        
        .btn-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(133, 234, 102, 0.4);
        }
        
        .update-icon {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
      `}</style>
      <div 
        style={overlayStyle}
      >
        <div style={popupStyle}>
          <div className="card" style={cardStyle}>
            {/* Header */}
            <div className="text-white p-4 position-relative" style={gradientHeaderStyle}>
              <button
                className="close-btn position-absolute top-0 end-0 m-3"
                onClick={()=>props.setShowUpdateNotification(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  color: 'white'
                }}
              >
                ✕
              </button>
              <div className="d-flex align-items-center mb-3">
                <div className="update-icon me-3" style={{ fontSize: '2rem' }}>
                  📥
                </div>
                <div>
                  <h4 className="mb-1 fw-bold">Update Available!</h4>
                  <span className="badge px-3 py-2" style={versionBadgeStyle}>
                    <span className="me-1">🏷️</span>Version : {CURRENT_VERSION}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
             
                <>
                  <h5 className="card-title text-primary mb-3">
                    <span className="me-2">⭐</span>
                    {updateData.title}
                  </h5>
                  
                  <p className="text-muted mb-4">
                    {updateData.description}
                  </p>

                  {/* Features List */}
                  <div className="bg-light rounded-3 p-3 mb-4">
                    <h6 className="fw-bold mb-3 text-dark">
                      <span className="me-2">✨</span>What's New:
                    </h6>
                    
                    {newUpdateNotification.features.map((feature, index) => (
                      <div key={index} className="feature-item p-2 mb-2">
                        <span className="me-2" style={{ fontSize: '1.2rem' }}>
                          {feature.icon}
                        </span>
                        <small className="text-dark">{feature.text}</small>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <small className="text-muted">
                      <span className="me-1">📅</span>
                      Released on {newUpdateNotification.releaseDate}
                    </small>
                    <span className="badge bg-success">
                      <span className="me-1">✅</span>Stable Release
                    </span>
                  </div>
                </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUpdateAlertWindow;