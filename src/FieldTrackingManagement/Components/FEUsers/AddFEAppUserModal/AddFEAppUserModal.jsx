import  { useState } from "react";
import styles from "./AddFEAppUserModal.module.css";
import { X, Contact, Search, User, Mail, Check, UserPlus, Loader2 } from "lucide-react";

const AddFEAppUserModal = ({ showCanvas, setShowCanvas }) => {
    const [empCode, setEmpCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetched, setIsFetched] = useState(false);

    const handleFetch = () => {
        if (!empCode) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsFetched(true);
        }, 800);
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
                    <button className={styles.closeButton} onClick={() => setShowCanvas(false)}>
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
                                />
                            </div>
                            <button className={styles.fetchButton} onClick={handleFetch} disabled={isLoading}>
                                {isLoading ? <Loader2 className={styles.spinner} size={16} /> : <Search size={16} />}
                                {isLoading ? "Fetching..." : "Fetch"}
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
                                    <input type="text" readOnly className={styles.readOnlyField} value={isFetched ? "Ramesh Kumar" : ""} placeholder="---" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.fieldLabel}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input type="text" readOnly className={styles.readOnlyField} value={isFetched ? "ramesh@company.com" : ""} placeholder="---" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={() => setShowCanvas(false)}>Cancel</button>
                    <button className={styles.saveBtn} disabled={!isFetched}>
                        <Check size={18} /> Save Access
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFEAppUserModal;