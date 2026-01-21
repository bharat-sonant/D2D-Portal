import { useEffect } from 'react';
import { CheckCircle2, OctagonAlert, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastContainer.module.css';

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  // Single toast logic: Hamesha latest wala dikhao
  const activeToast = toasts[toasts.length - 1];

  return (
    <div className={styles.toastContainer}>
      <ToastItem 
        key={activeToast.id} 
        {...activeToast} 
        onRemove={onRemove} 
      />
    </div>
  );
};

const ToastItem = ({ id, message, type, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const icons = {
    success: <CheckCircle2 size={20} />,
    error: <OctagonAlert size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.iconBox}>{icons[type]}</div>
      
      {/* Is content div par flex: 1 close button ko end mein push karega */}
      <div className={styles.content}>
        <p className={styles.toastMessage}>{message}</p>
      </div>

      <button onClick={() => onRemove(id)} className={styles.closeBtn}>
        <X size={18} />
      </button>

      <div className={`${styles.progress} ${styles[`progress_${type}`]}`} />
    </div>
  );
};

export default ToastContainer;