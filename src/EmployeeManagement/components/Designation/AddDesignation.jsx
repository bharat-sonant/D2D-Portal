import { useEffect, useState } from "react";
import modalStyles from "../../../assets/css/popup.module.css";
import { X, Briefcase, Loader2 } from "lucide-react";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { validateDesignationDetail } from "../../Action/Designation/DesignationAction";

const AddDesignation = (props) => {
    const [form, setForm] = useState({ name: "" });
    const [nameError, setNameError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.showCanvas) {
            if (props.initialData) {
                setForm({ name: props.initialData.name || "" });
            } else {
                setForm({ name: "" });
            }
            setNameError("");
        }
    }, [props.showCanvas, props.initialData]);

    if (!props.showCanvas) return null;

    const handleChange = (e) => {
        const { value } = e.target;
        setForm({ name: value });
        if (nameError) setNameError("");
    };

    const handleSave = () => {
        validateDesignationDetail(form, props.initialData?.id, setNameError, setLoading, props.departmentId, setForm, props.setShowCanvas);
    };

    return (
        <div className={modalStyles.overlay}>
            <div className={modalStyles.modal} style={{ maxWidth: 420 }}>
                <div className={modalStyles.modalHeader}>
                    <div className={modalStyles.headerLeft}>
                        <div className={modalStyles.iconWrapper}>
                            <Briefcase size={22} />
                        </div>
                        <div className={modalStyles.headerTextRight}>
                            <h2 className={modalStyles.modalTitle}>{props.initialData ? "Edit Designation" : "Add Designation"}</h2>
                        </div>
                    </div>
                    <button className={modalStyles.closeBtn} onClick={() => props.setShowCanvas(false)} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className={modalStyles.modalBody} style={{ padding: 20 }}>
                    <div className={modalStyles.inputGroup}>
                        <label className={modalStyles.label}>Designation Name</label>
                        <div className={modalStyles.inputWrapper}>
                            <input className={modalStyles.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Manager" />
                        </div>
                        {nameError && <ErrorMessage message={nameError} />}
                    </div>

                    {/* single input only as requested */}
                </div>

                <div className={modalStyles.modalFooter}>
                    <button className={modalStyles.cancelBtn} onClick={() => props.setShowCanvas(false)} disabled={loading}>Cancel</button>
                    <button className={modalStyles.submitBtn} onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                        {loading ? " Saving..." : " Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDesignation;
