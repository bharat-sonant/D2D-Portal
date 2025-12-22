import React, { useState } from 'react';
import styles from '../../Styles/DeleteConfirmation/DeleteConfirmation.module.css';
import { IoWarningOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const StatusConfirmation = ({ isOpen, onClose, onConfirm, status = "active", itemName = "this task" }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        await onConfirm();
        setIsProcessing(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    disabled={isProcessing}
                >
                    <IoClose />
                </button>

                <div className={styles.iconContainer}>
                    <div className={styles.iconCircle}>
                        <IoWarningOutline className={styles.warningIcon} />
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>
                        Are you sure ?
                    </h2>
                    <p className={styles.description}>
                        You want to set <strong>{itemName}</strong> status is <strong>{status}</strong>?
                    </p>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.deleteButton}
                            style={{ backgroundColor: status === 'active' ? '#10b981' : '#ef4444' }}
                            onClick={handleConfirm}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Updating...
                                </>
                            ) : (
                                'Confirm'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusConfirmation;
