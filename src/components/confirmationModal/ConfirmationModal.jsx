import styles from "./confirmationModal.module.css";

const ConfirmationModal = ({
  visible = false,
  title = "Are you sure?",
  message = "",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
  btnColor
}) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttonRow}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {cancelText}
          </button>
          
          <button className={styles.confirmBtn} style={{backgroundColor:btnColor || ''}} st onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
