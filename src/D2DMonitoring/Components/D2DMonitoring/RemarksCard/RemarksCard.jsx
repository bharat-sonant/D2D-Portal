import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import styles from "./RemarksCard.module.css";

const RemarksCard = ({ remarks, onAddRemark, onEditRemark, onDeleteRemark }) => {
  return (
    <div className={styles.glassCard}>
      <div className={styles.remarksHeadRow}>
        <div className={styles.remarksHeadLeft}>
          <Plus size={16} color="var(--themeColor)" />
          <span className={styles.remarksHeadTitle}>Remark</span>
        </div>
        <button
          type="button"
          className={styles.addRemarkBtn}
          onClick={onAddRemark}
        >
          Add
        </button>
      </div>
      {remarks.length === 0 ? (
        <div className={styles.remarkEmpty}>
          No query yet. Click Add New to create one.
        </div>
      ) : (
        <div className={styles.remarkList}>
          {remarks.map((item) => (
            <div key={item.id} className={styles.remarkItemCard}>
              <div className={styles.remarkItemTopic}>{item.topic}</div>
              <div className={styles.remarkItemDescription}>{item.description}</div>
              <div className={styles.remarkItemActions}>
                <button
                  type="button"
                  className={styles.remarkActionBtn}
                  onClick={() => onEditRemark(item)}
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  type="button"
                  className={`${styles.remarkActionBtn} ${styles.deleteActionBtn}`}
                  onClick={() => onDeleteRemark(item.id)}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemarksCard;
