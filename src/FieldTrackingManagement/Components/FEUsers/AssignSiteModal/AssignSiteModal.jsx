import { useState } from 'react';
import styles from './AssignSiteModal.module.css';
import { X, User, Check, Fingerprint, MapPinned } from 'lucide-react';

const AssignSiteModal = ({ user, availableSites, onClose, onAssign }) => {
  // selectedSite mein ab hum pura site object ya siteName store karenge
  // user.site agar string hai toh use match karne ke liye handle kar rahe hain
  const [selectedSite, setSelectedSite] = useState(user?.site || null);

  const handleSave = () => {
    if (selectedSite) {
      // Backend par hum siteName bhej rahe hain (aapki parent logic ke according)
      onAssign(user.id, selectedSite);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.iconBox}>
            <MapPinned size={24} />
          </div>
          <div className={styles.headerTitle}>
            <h2>Site Allocation</h2>
            <p>Assign operational site to field executive</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Field Executive Name</label>
            <div className={styles.readOnlyInput}>
              <User size={18} className={styles.fieldIcon} />
              {user.name}
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Employee Code</label>
            <div className={styles.readOnlyInput}>
              <Fingerprint size={18} className={styles.fieldIcon} />
              {user.code}
            </div>
          </div>
        </div>

        <div className={styles.selectionArea}>
          <label className={styles.label}>Choose Available Site</label>
          <div className={styles.siteList}>
            {availableSites && availableSites.length > 0 ? (
              availableSites.map((site) => (
                <div 
                  key={site.siteId} 
                  className={`${styles.siteCard} ${selectedSite === site.siteName ? styles.activeCard : ''}`}
                  onClick={() => setSelectedSite(site.siteName)}
                >
                  <div className={styles.siteInfoWrapper}>
                    <span className={styles.siteNameText}>{site.siteName}</span>
                   
                  </div>
                  <div className={styles.radio}>
                    {selectedSite === site.siteName && (
                      <Check size={12} color="white" strokeWidth={4} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData}>No sites available for allocation.</div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button 
            className={styles.saveBtn} 
            onClick={handleSave}
            disabled={!selectedSite || selectedSite === user.site}
          >
            <Check size={18} /> Assign Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSiteModal;