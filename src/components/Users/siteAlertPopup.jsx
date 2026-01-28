import React, { useState, useEffect } from 'react';

export default function SiteAssignmentAlert(props) {
  const [showAlert, setShowAlert] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [showAlert]);



  const handleCloseAlert = () => {

    setAnimateIn(false);
    setTimeout(() => props.setSiteAlertPopup(false), 300);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
      
        
        .alert-container {
          text-align: center;
        }
        
        .trigger-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          border: none;
          padding: 18px 48px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
        }
        
        .trigger-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
        }
        
        .trigger-btn:active {
          transform: translateY(0);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modal-overlay.show {
          opacity: 1;
        }
        
        .alert-modal {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 480px;
          padding: 0;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .modal-overlay.show .alert-modal {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        
        .modal-header-custom {
          padding: 32px 32px 0;
          position: relative;
        }
        
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f1f5f9;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #64748b;
          font-size: 20px;
          font-weight: 300;
        }
        
        .close-btn:hover {
          background: #e2e8f0;
          transform: rotate(90deg);
        }
        
        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 15px 40px rgba(251, 191, 36, 0.5);
          }
        }
        
        .warning-icon {
          font-size: 40px;
          color: white;
          animation: bounce 1s ease-in-out;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        .modal-body-custom {
          padding: 0 32px 32px;
          text-align: center;
        }
        
        .alert-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        
        .alert-message {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .modal-footer-custom {
          padding: 24px 32px 32px;
          display: flex;
          gap: 12px;
        }
        
        .btn-custom {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        
        .btn-primary-custom {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary-custom {
          background: #f1f5f9;
          color: #475569;
        }
        
        .btn-secondary-custom:hover {
          background: #e2e8f0;
        }
        
        .decorative-line {
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
        }
      `}</style>

     

      {showAlert && (
        <div className={`modal-overlay ${animateIn ? 'show' : ''}`} onClick={handleCloseAlert}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
           
            <div className="modal-header-custom">
              <button className="close-btn" onClick={handleCloseAlert}>
                ×
              </button>
              <div className="icon-wrapper">
                <span className="warning-icon">⚠</span>
              </div>
            </div>
            <div className="modal-body-custom">
              <h3 className="alert-title">Action Required</h3>
              <p className="alert-message">
                Please assign at least one site to this user.
              </p>
            </div>
            <div className="modal-footer-custom">
              <button className="btn-custom btn-secondary-custom" onClick={handleCloseAlert}>
                Cancel
              </button>
              <button className="btn-custom btn-primary-custom" onClick={handleCloseAlert}>
                Assign Site
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}