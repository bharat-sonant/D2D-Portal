import React from "react";
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
  return (
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
      <button className={styles.modalSubmitBtn} onClick={onSubmit}>
        {editingRemarkId ? "Update Query" : "Submit Query"}
      </button>
    </div>
  );
};

export default RemarkFormModal;
