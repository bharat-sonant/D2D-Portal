import { useState } from 'react';
import styles from './AssignSiteModal.module.css';
import { X, User, Check, Fingerprint, MapPinned } from 'lucide-react';

const AssignSiteModal = ({ user, availableSites, onClose, onAssign }) => {
  // 1️⃣ Hum selectedSite mein pura 'siteId' store karenge 
  // Initial value match karne ke liye availableSites mein se find kar rahe hain
  const initialSite = availableSites.find(s => s.siteName === user?.site);
  const [selectedSiteId, setSelectedSiteId] = useState(initialSite?.siteId || null);

  const handleSave = () => {
    if (selectedSiteId) {
      // 2️⃣ Final select kiya hua object find karo
      const selectedObj = availableSites.find(s => s.siteId === selectedSiteId);
      
      // 3️⃣ onAssign ko Emp Code aur pura site object bhej rahe hain
      // Taaki parent action mein 'siteId' (for DB) aur 'siteName' (for UI) dono mil sakein
      onAssign(user.code, selectedObj); 
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
      

        <div className={styles.header}>
          <div className={styles.iconBox}><MapPinned size={24} /></div>
          <div className={styles.headerTitle}>
            <h2>Site Allocation</h2>
            <p>Assign operational site to field executive</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Field Executive Name</label>
            <div className={styles.readOnlyInput}>
              <User size={18} className={styles.fieldIcon} /> {user.name}
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Employee Code</label>
            <div className={styles.readOnlyInput}>
              <Fingerprint size={18} className={styles.fieldIcon} /> {user.code}
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
                  // 4️⃣ Selection logic ab siteId par based hai
                  className={`${styles.siteCard} ${selectedSiteId === site.siteId ? styles.activeCard : ''} ${site.status !== 'active' ? styles.disabledCard : ''}`}
                  onClick={() => site.status === 'active' && setSelectedSiteId(site.siteId)}
                >
                  <div className={styles.siteInfoWrapper}>
                    <span className={styles.siteNameText}>{site.siteName}</span>
                
                  </div>
                  <div className={styles.radio}>
                    {selectedSiteId === site.siteId && (
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
            // Button tab disable hoga agar koi site select nahi hai ya wahi purani site select ki hai
            disabled={!selectedSiteId || selectedSiteId === initialSite?.siteId}
          >
            <Check size={18} /> Assign Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSiteModal;