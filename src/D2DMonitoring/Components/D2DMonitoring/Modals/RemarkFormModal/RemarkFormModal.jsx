import React from "react";
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
  const footer = (
    <button className={styles.modalSubmitBtn} onClick={onSubmit}>
      {editingRemarkId ? "Update Query" : "Submit Query"}
    </button>
  );

  return (
    <MonitoringModal
      title={editingRemarkId ? "Edit Field Query" : "Add Field Query"}
      icon={<MessageSquare size={16} />}
      width="sm"
      onClose={onClose}
      footer={footer}
    >
      <div className={styles.remarkFormWrap}>
        <div className={styles.customDropdownWrap}>
          <button
            type="button"
            className={styles.customDropdownToggle}
            onClick={onTopicDropdownToggle}
          >
            {remarkForm.topic || "Select Remark Topic"}
          </button>
          {showTopicDropdown && (
            <div className={styles.customDropdownMenu}>
              {remarkTopicOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={styles.customDropdownItem}
                  onClick={() => onTopicSelect(item)}
                >
                  {item}
                </button>
              ))}
            </div>
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
