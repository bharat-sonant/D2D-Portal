import React, { useState } from 'react';
import styles from './AssignSiteModal.module.css';
import { X, User, MapPin, Check, Fingerprint, MapPinned } from 'lucide-react';

const AssignSiteModal = ({ user, managerSites, onClose, onAssign }) => {
  // Static sites functionality for demonstration
  const availableSites = managerSites || ["Chandpole Hub", "Jaipur Main", "Kota Station", "Pali Office","Ajmer","Udaipur Center","Jodhpur Point"];
  const [selectedSite, setSelectedSite] = useState(user?.site || null);

  const handleSave = () => {
    if (selectedSite) {
      onAssign(user.id, selectedSite);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Close Button as per image */}
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

        {/* User Info in One Row */}
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

        {/* Site Selection Area */}
        <div className={styles.selectionArea}>
          <label className={styles.label}>Choose Site</label>
          <div className={styles.siteList}>
            {availableSites.map((site, index) => (
              <div 
                key={index}
                className={`${styles.siteCard} ${selectedSite === site ? styles.activeCard : ''}`}
                onClick={() => setSelectedSite(site)}
              >
                <span style={{fontSize: '0.9rem', color: '#475569'}}>{site}</span>
                <div className={styles.radio}>
                  {selectedSite === site && <Check size={12} color="white" strokeWidth={4} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
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