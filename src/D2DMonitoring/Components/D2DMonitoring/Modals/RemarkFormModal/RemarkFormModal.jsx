import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare } from "lucide-react";
import MonitoringModal from "../../Common/MonitoringModal/MonitoringModal";
import styles from "./RemarkFormModal.module.css";

const DESC_MAX = 300;

const RemarkFormModal = ({
  remarkForm,
  editingRemarkId,
  showTopicDropdown,
  remarkTopicOptions,
  onTopicDropdownToggle,
  onTopicSelect,
  onDescriptionChange,
  onSubmit,
  onClose,
}) => {
  const toggleRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});
  const [errors, setErrors] = useState({ topic: "", description: "" });

  useEffect(() => {
    if (showTopicDropdown && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [showTopicDropdown]);

  const handleTopicSelect = (label) => {
    onTopicSelect(label);
    setErrors((prev) => ({ ...prev, topic: label ? "" : "Please select a remark topic." }));
  };

  const handleDescriptionChange = (value) => {
    onDescriptionChange(value);
    const desc = value.trim();
    let msg = "";
    if (!desc) msg = "Description is required.";
    else if (desc.length > DESC_MAX) msg = `Maximum ${DESC_MAX} characters allowed.`;
    setErrors((prev) => ({ ...prev, description: msg }));
  };

  const validate = () => {
    const newErrors = { topic: "", description: "" };
    if (!remarkForm.topic) {
      newErrors.topic = "Please select a remark topic.";
    }
    const desc = (remarkForm.description || "").trim();
    if (!desc) {
      newErrors.description = "Description is required.";
    } else if (desc.length > DESC_MAX) {
      newErrors.description = `Maximum ${DESC_MAX} characters allowed.`;
    }
    setErrors(newErrors);
    return !newErrors.topic && !newErrors.description;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  const descLength = (remarkForm.description || "").length;
  const isOverLimit = descLength > DESC_MAX;

  const footer = (
    <button className={styles.modalSubmitBtn} onClick={handleSubmit}>
      {editingRemarkId ? "Update Remark" : "Add Remark"}
    </button>
  );

  return (
    <MonitoringModal
      title={editingRemarkId ? "Edit Remark" : "Add Remark"}
      icon={<MessageSquare size={16} />}
      width="sm"
      onClose={onClose}
      footer={footer}
    >
      <div className={styles.remarkFormWrap}>

        {/* ── Topic Dropdown ── */}
        <div className={styles.fieldGroup}>
          <div className={styles.customDropdownWrap}>
            <button
              ref={toggleRef}
              type="button"
              className={`${styles.customDropdownToggle} ${errors.topic ? styles.inputError : ""}`}
              onClick={onTopicDropdownToggle}
            >
              <span className={remarkForm.topic ? "" : styles.placeholder}>
                {remarkForm.topic || "Select Remark Topic"}
              </span>
            </button>
            {showTopicDropdown &&
              createPortal(
                <div className={styles.customDropdownMenu} style={menuStyle}>
                  {remarkTopicOptions.map((item) => {
                    const label = typeof item === "string" ? item : item.name;
                    const key = typeof item === "string" ? item : (item.id ?? item.name);
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.customDropdownItem} ${remarkForm.topic === label ? styles.customDropdownItemActive : ""}`}
                        onClick={() => handleTopicSelect(label)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>,
                document.body,
              )}
          </div>
          {errors.topic && <p className={styles.errorMsg}>{errors.topic}</p>}
        </div>

        {/* ── Description Textarea ── */}
        <div className={styles.fieldGroup}>
          <textarea
            className={`${styles.remarkTextarea} ${errors.description ? styles.inputError : ""}`}
            placeholder="Remark Description"
            value={remarkForm.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            maxLength={DESC_MAX + 10}
          />
          <div className={styles.textareaFooter}>
            {errors.description
              ? <p className={styles.errorMsg}>{errors.description}</p>
              : <span />
            }
            <span className={`${styles.charCount} ${isOverLimit ? styles.charCountOver : ""}`}>
              {descLength}/{DESC_MAX}
            </span>
          </div>
        </div>

      </div>
    </MonitoringModal>
  );
};

export default RemarkFormModal;
