import { useState } from "react";
import "./AlertPopUp.css";

export default function UserStatusDialog(props) {
  const [showModal, setShowModal] = useState(true);

  const isActive = props.selectedUser.status === "active";

  const config = isActive
    ? {
        message: "Are you sure you want to deactivate ",
        buttonText: "Deactivate",
        buttonColor: "#dc2626",
        buttonGradient: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
        iconBg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
        iconAnimation: "pulse",
        icon: "warning",
      }
    : {
        message: "Are you sure you want to activate ",
        buttonText: "Activate",
        buttonColor: "#10b981",
        buttonGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        iconBg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
        iconAnimation: "bounce",
        icon: "check",
      };

  return (
    <div className="dialog-wrapper">
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            "--icon-bg": config.iconBg,
            "--button-gradient": config.buttonGradient,
            "--button-color": config.buttonColor,
            "--icon-animation": config.iconAnimation,
          }}
        >
          <div className="modal-content-custom">
            <button
              className="close-btn"
              onClick={() => {
                props.setConfirmUser(null);
                setShowModal(false);
              }}
            >
              ×
            </button>

            <div className="icon-wrapper">
              {config.icon === "warning" ? (
                <svg className="icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"
                    stroke={config.buttonColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"
                    stroke={config.buttonColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <p className="modal-text">
              {config.message}
              <strong>{props.name}</strong>?
            </p>

            <div className="button-group">
              <button
                className="btn-custom btn-cancel"
                onClick={() => {
                  props.setConfirmUser(null);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>

              <button
                className="btn-custom btn-action"
                onClick={() => props.handleStatusToggle(props.selectedUser)}
              >
                {config.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
