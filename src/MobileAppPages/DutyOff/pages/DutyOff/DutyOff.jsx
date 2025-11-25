import React, { useEffect, useState } from 'react'
import styles from '../../styles/DutyOff.module.css'
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../../components/confirmationModal/ConfirmationModal';
import { CompleteAssignmentAction, getDutyOffDetails } from '../../actions/DutyOffAction';

const DutyOff = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({})
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const ward = queryParams.get("task") || "Govind";

  useEffect(() => {
    getDetails(ward)
  },[])

  const getDetails = async(ward) => {
    await getDutyOffDetails(ward, setDetails);
  }


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

  const handleConfirm = async()=> {
    await CompleteAssignmentAction(ward, details.vehicle, details.driver, details.helper);
    setShowModal(false);
    navigate('/AssignmentSummary')
  }

  const handleSubmit = async() => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
      <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft/>
        </button>
        <h1 className={styles.headerTitle}>Duty Off {ward}</h1>
      </div>

        <div className={styles.contentContainer}>
         <div className={styles.detailCard}>
          <h2 className={styles.sectionTitle}>Assigned Details</h2>

          <div className={styles.detailRow}>
            <span className={styles.label}>Ward:</span>
            <span className={styles.value}>{ward}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Vehicle:</span>
            <span className={styles.value}>{details.vehicle || "N/A"}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Driver:</span>
            <span className={styles.value}>{details.driver || "N/A"}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Helper:</span>
            <span className={styles.value}>{details.helper || "N/A"}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Assigned At:</span>
            <span className={styles.value}>{details.assignedAt || "N/A"} </span>
          </div>
        </div>


        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className={styles.loaderWrapper}>
              <span className={styles.loaderCircle}></span>
              Saving...
            </div>
          ) : (
            "Complete Task"
          )}
        </button>
    </div>

    <ConfirmationModal
    visible={showModal}
    title='Complete Task ?'
    message='Are you sure you want to complete this task? This will mark the task as completed and release the vehicle/driver/helper.'
    confirmText='Confirm'
    cancelText='Cancel'
    onConfirm={handleConfirm}
    onCancel={handleCloseModal}
    />

     
    </div>
  )
}

export default DutyOff
