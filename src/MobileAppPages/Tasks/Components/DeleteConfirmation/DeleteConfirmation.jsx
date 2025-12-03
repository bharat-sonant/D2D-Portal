import React, { useState } from 'react';
import styles from '../../Styles/DeleteConfirmation/DeleteConfirmation.module.css';
import { IoWarningOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, itemName = "this task" }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        await onConfirm();
        setIsDeleting(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    disabled={isDeleting}
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
                        You want to delete <span className={styles.itemName}>{itemName}</span>?  This action cannot be undone.
                    </p>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={handleConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;