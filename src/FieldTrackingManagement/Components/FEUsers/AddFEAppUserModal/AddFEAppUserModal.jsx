import { useState } from "react";
import styles from "./AddFEAppUserModal.module.css";
import { X, Contact, Search, User, Mail, Check, UserPlus, Loader2 } from "lucide-react";
import * as action from '../../../Actions/FEUsers/FEUsers_Action';

const AddFEAppUserModal = ({ showCanvas, setShowCanvas, onSuccess }) => {
    const [empCode, setEmpCode] = useState("");
    const [isFetching, setIsFetching] = useState(false); // Sirf fetch ke liye
    const [isSaving, setIsSaving] = useState(false);     // Save button ke liye
    const [isFetched, setIsFetched] = useState(false);
    const [empData, setEmpData] = useState({ name: "", email: "" });

    const handleFetch = () => {
        // Fetch action call - yahan setIsFetching pass kiya hai
        action.fetchEmpDetail(empCode, setEmpData, setIsFetching, setIsFetched);
    };

    const handleSave = () => {
        // Save action call - yahan isSaving pass kiya hai
        action.createFEAppUser(
            empCode, 
            empData, 
            setIsSaving, // Alag loader state bhej rahe hain
            () => {
                handleClose(); 
            },
            onSuccess
        );
    };

    const handleClose = () => {
        setShowCanvas(false);
        setEmpData({ name: "", email: "" });
        setEmpCode("");
        setIsFetched(false);
        setIsSaving(false);
        setIsFetching(false);
    };

    if (!showCanvas) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitleSection}>
                        <div className={styles.brandIconBox}>
                            <UserPlus size={22} color="white" />
                        </div>
                        <div>
                            <h2 className={styles.mainTitle}>Field Executive Access</h2>
                            <p className={styles.subtitle}>Setup mobile application credentials</p>
                        </div>
                    </div>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.body}>
                    {/* Employee Code Section */}
                    <div className={styles.inputGroupFull}>
                        <label className={styles.fieldLabel}>Employee Code *</label>
                        <div className={styles.searchContainer}>
                            <div className={styles.inputWrapper}>
                                <Contact className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g. 1001"
                                    className={styles.mainInput}
                                    value={empCode}
                                    onChange={(e) => setEmpCode(e.target.value)}
                                    disabled={isFetching || isSaving}
                                />
                            </div>
                            <button 
                                className={styles.fetchButton} 
                                onClick={handleFetch} 
                                disabled={isFetching || !empCode || isSaving}
                            >
                                {isFetching ? (
                                    <Loader2 className={styles.spinner} size={16} />
                                ) : (
                                    <Search size={16} />
                                )}
                                {isFetching ? "Fetching..." : "Fetch"}
                            </button>
                        </div>
                    </div>

                    <div className={styles.sectionDivider}>
                        <span>{isFetched ? "Profile Verified" : "Verification Required"}</span>
                    </div>

                    <div className={`${styles.detailsSection} ${isFetched ? styles.visible : styles.dimmed}`}>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.fieldLabel}>Employee Name</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={18} />
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className={`${styles.readOnlyField} ${styles.nameField}`}  
                                        value={isFetched ? empData.name : ""} 
                                        placeholder="---" 
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.fieldLabel}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className={styles.readOnlyField} 
                                        value={isFetched ? empData.email : ""} 
                                        placeholder="---" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button 
                        className={styles.cancelBtn} 
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button 
                        className={styles.saveBtn} 
                        disabled={!isFetched || isSaving} 
                        onClick={handleSave}
                    >
                        {isSaving ? (
                            <Loader2 className={styles.spinner} size={18} />
                        ) : (
                            <Check size={18} />
                        )}
                        {isSaving ? "Saving..." : "Save Access"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFEAppUserModal;