import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";

const FirebaseConfigModal = ({ show, onHide, selectedCity, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedCity?.firebaseConfig) {
            setForm(selectedCity.firebaseConfig);
        } else {
            setForm({
                apiKey: "",
                authDomain: "",
                databaseURL: "",
                projectId: "",
                storageBucket: "",
                messagingSenderId: "",
                appId: "",
                measurementId: "",
            });
        }
    }, [selectedCity]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.apiKey?.trim()) newErrors.apiKey = "API Key is required";
        if (!form.authDomain?.trim()) newErrors.authDomain = "Auth Domain is required";
        if (!form.databaseURL?.trim()) newErrors.databaseURL = "Database URL is required";
        if (!form.projectId?.trim()) newErrors.projectId = "Project ID is required";
        if (!form.storageBucket?.trim()) newErrors.storageBucket = "Storage Bucket is required";
        if (!form.messagingSenderId?.trim()) newErrors.messagingSenderId = "Messaging Sender ID is required";
        if (!form.measurementId?.trim()) newErrors.measurementId = "Measurement ID is required";
        if (!form.appId?.trim()) newErrors.appId = "App ID is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await onSave(form, setLoading);
        } catch (error) {
            console.error("Error saving firebase config:", error);
        }
    };

    if (!show) return null;

    const fields = [
        { label: "API Key", name: "apiKey", placeholder: "Enter API Key" },
        { label: "Auth Domain", name: "authDomain", placeholder: "Enter Auth Domain" },
        { label: "Database URL", name: "databaseURL", placeholder: "Enter Database URL" },
        { label: "Project ID", name: "projectId", placeholder: "Enter Project ID" },
        { label: "Storage Bucket", name: "storageBucket", placeholder: "Enter Storage Bucket" },
        { label: "Messaging Sender ID", name: "messagingSenderId", placeholder: "Enter Messaging Sender ID" },
        { label: "App ID", name: "appId", placeholder: "Enter App ID" },
        { label: "Measurement ID", name: "measurementId", placeholder: "Enter Measurement ID (Optional)" },
    ];

    return (
        <div className={styles.overlay} aria-modal="true" role="dialog">
            <div className={`${styles.modal} ${styles.modalTask}`}>
                <div className={styles.actionBtn}>
                    <p className={styles.headerText}>Firebase Configuration - {selectedCity?.CityName}</p>
                    <button className={styles.closeBtn} onClick={onHide} aria-label="Close">
                        <img src={images.iconClose} className={styles.iconClose} alt="close" />
                    </button>
                </div>

                <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {fields.map((field) => (
                        <div className={styles.textboxGroup} key={field.name}>
                            <div className={styles.textboxMain}>
                                <div className={styles.textboxLeft}>{field.label}</div>
                                <div className={styles.textboxRight}>
                                    <input
                                        type="text"
                                        className={`form-control ${styles.formTextbox}`}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {errors[field.name] && <div className={styles.invalidfeedback}>{errors[field.name]}</div>}
                        </div>
                    ))}

                    <button type="button" className={`mt-3 ${styles.btnSave}`} onClick={handleSave}>
                        {loading ? (
                            <div className={styles.Loginloadercontainer}>
                                <FaSpinner className={styles.spinnerLogin} />
                                <span className={styles.loaderText}>Please wait...</span>
                            </div>
                        ) : "Save Configuration"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirebaseConfigModal;
