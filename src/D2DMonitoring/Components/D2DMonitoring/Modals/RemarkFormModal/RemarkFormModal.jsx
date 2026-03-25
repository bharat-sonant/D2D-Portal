import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare } from "lucide-react";
import MonitoringModal from "../../Common/MonitoringModal/MonitoringModal";
import styles from "./RemarkFormModal.module.css";

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

  const footer = (
    <button className={styles.modalSubmitBtn} onClick={onSubmit}>
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
        <div className={styles.customDropdownWrap}>
          <button
            ref={toggleRef}
            type="button"
            className={styles.customDropdownToggle}
            onClick={onTopicDropdownToggle}
          >
            {remarkForm.topic || "Select Remark Topic"}
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
                      onClick={() => onTopicSelect(label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>,
              document.body,
            )}
        </div>
        <textarea
          className={styles.remarkTextarea}
          placeholder="Remark Description"
          value={remarkForm.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </MonitoringModal>
  );
};

export default RemarkFormModal;
