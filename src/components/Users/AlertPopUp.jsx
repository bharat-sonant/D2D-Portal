import React, { useState } from 'react';

export default function UserStatusDialog(props) {
  const [showModal, setShowModal] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);


 
 

  const config = props.selectedUser.status === 'active' ? {
    message: ` Are you sure you want to deactivate `,
    buttonText: 'Deactivate',
    buttonColor: '#dc2626',
    buttonGradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    iconBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    iconColor: '#dc2626',
    icon: 'warning',
    successTitle: 'User Deactivated!',
    successMessage: 'The user has been deactivated successfully.'
  } : {
   
    message: ` Are you sure you want to activate `,
    buttonText: 'Activate',
    buttonColor: '#10b981',
    buttonGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    iconBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    iconColor: '#10b981',
    icon: 'check',
    successTitle: 'User Activated!',
    successMessage: 'The user has been activated successfully.'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: ${showModal ? 'fadeIn' : 'fadeOut'} 0.3s ease;
        }

        .modal-content-custom {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
          animation: ${showModal ? 'fadeIn' : 'fadeOut'} 0.3s ease;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          font-size: 24px;
          color: #999;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
          transform: rotate(90deg);
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background: ${config.iconBg};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ${config.icon === 'warning' ? 'pulse' : 'bounce'} 2s infinite;
          transition: all 0.5s ease;
        }

        .icon {
          width: 45px;
          height: 45px;
          animation: ${config.icon === 'warning' ? 'shake' : ''} 0.5s ease;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          text-align: center;
        }

        .modal-text {
          color: #6b7280;
          text-align: center;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .user-name {
          color: ${config.buttonColor};
          font-weight: 700;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .btn-custom {
          flex: 1;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-action {
          background: ${config.buttonGradient};
          color: white;
        }

        .btn-action:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px ${config.buttonColor}66;
        }

        .btn-action:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .success-icon {
          width: 60px;
          height: 60px;
        }

        .checkmark {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkmark 0.6s ease forwards;
        }

        .control-panel {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          gap: 15px;
          flex-direction: column;
        }

        .demo-button {
          padding: 15px 30px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .demo-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
        }

        .toggle-button {
          padding: 15px 30px;
          background: ${config.buttonGradient};
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .toggle-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          background: ${config.iconBg};
          color: ${config.buttonColor};
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 10px;
        }
      `}</style>

      {showModal && (
        <div className="modal-overlay" >
          <div className="modal-content-custom">
            <button className="close-btn"   onClick={() =>{props.setConfirmUser(null);setShowModal(false)}}>×</button>
            
           
              <>
                <div className="icon-wrapper">
                  {config.icon === 'warning' ? (
                    <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke={config.iconColor} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                        stroke={config.iconColor} 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <h2 className="modal-title">{config.title}</h2>
                
                <p className="modal-text">
                  {config.message}<strong>{props.name}</strong>?
                </p>

              

                <div className="button-group">
                  <button 
                    className="btn-custom btn-cancel" 
                    onClick={() => {props.setConfirmUser(null);setShowModal(false)}}
                  
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-custom btn-action" 
                     onClick={() => {props.handleStatusToggle(props.selectedUser);}}

                  >
                  
                      {config.buttonText}
                    
                  </button>
                </div>
              </>
           
          </div>
        </div>
      )}
    </div>
  );
}