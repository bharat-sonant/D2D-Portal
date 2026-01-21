// import { useEffect } from "react";
// import styles from "./confirmationModal.module.css";

// const ConfirmationModal = ({
//   visible = false,
//   title = "Are you sure?",
//   message = "",
//   confirmText = "Yes",
//   cancelText = "Cancel",
//   onConfirm = () => {},
//   onCancel = () => {},
//   btnColor,
// }) => {
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Enter") {
//         e.preventDefault();
//         onConfirm();
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);
//   if (!visible) return null;

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <h3 className={styles.title}>{title}</h3>
//         <p className={styles.message}>{message}</p>

//         <div className={styles.buttonRow}>
//           <button className={styles.cancelBtn} onClick={onCancel}>
//             {cancelText}
//           </button>

//           <button
//             className={styles.confirmBtn}
//             style={{ backgroundColor: btnColor || "" }}
//             st
//             onClick={onConfirm}
//           >
//             {confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationModal;
import { useEffect } from "react";
import GlobalAlertModal from "../GlobalAlertModal/GlobalAlertModal";

const ConfirmationModal = ({
  visible = false,
  title = "Are you sure?",
  message = "",
  confirmText,
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
  btnColor,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm]);

  if (!visible) return null;

  const isDeactivate =
    title.toLowerCase().includes("deactive") ||
    title.toLowerCase().includes("deactivate");

  const config = isDeactivate
    ? {
        iconType: "warning",
        buttonText: confirmText || "Yes, Deactivate",
        btnColor: btnColor || "#dc2626",
      }
    : {
        iconType: "success",
        buttonText: confirmText || "Yes, Activate",
        btnColor: btnColor || "#10b981",
      };

  return (
    <GlobalAlertModal
      show={visible}
      title={title}
      message={message}
      buttonText={config.buttonText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      iconType={config.iconType}
      btnColor={config.btnColor}
      warningText="This action will temporarily disable the city and all associated services. Users will not be able to access city-related features until it is reactivated."
      successText="This will activate the city and restore full access to all city-related services and features."
    />
  );
};

export default ConfirmationModal;
