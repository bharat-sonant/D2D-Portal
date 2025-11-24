import React from 'react'
import styles from '../../styles/DutyOff.module.css'
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const DutyOff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const ward = queryParams.get("task") || "Govind";

   const handleBack = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (
      isAndroid &&
      window.Android &&
      typeof window.Android.closeWebView === "function"
    ) {
      window.Android.closeWebView();
    } else {
      navigate(-1);
    }
  };

  return (
      <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft/>
        </button>
        <h1 className={styles.headerTitle}>Duty Off {ward}</h1>
      </div>

      <div className={styles.centerMessage}>
        Duty Off — Page coming soon. <br />
        <span className={styles.highlight}>Selected Task : {ward}</span>
      </div>

     
    </div>
  )
}

export default DutyOff
