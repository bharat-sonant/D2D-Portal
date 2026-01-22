import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, CheckCircle2, Plus, Image as ImageIcon, Video as VideoIcon, PlayCircle, FileText, UploadCloud } from 'lucide-react';
import CommonHeader from '../../Common/CommonHeader/CommonHeader';
import styles from './KpiTaskExecutionForm.module.css';

const TASK_LIST = ['Network Maintenance', 'Security Audit', 'Equipment Check', 'Fiber Test'];

const KpiTaskExecutionForm = ({ mode = 'PICK', taskData = null, onClose }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(taskData?.taskName || '');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [remark, setRemark] = useState('');
  
  const dropdownRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    if (type === 'img') setImages(prev => [...prev, ...urls].slice(0, 5));
    else setVideos(prev => [...prev, ...urls].slice(0, 2));
  };

  const removeMedia = (index, type) => {
    if (type === 'img') setImages(images.filter((_, i) => i !== index));
    else setVideos(videos.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.sidePanel}>
        <CommonHeader title={mode === 'ADD' ? 'Add KPI Task' : 'Task Execution'}  />

        <div className={styles.mainContent}>
          {/* SECTION 1: TASK SELECTION */}
          <div className={styles.card}>
            <label className={styles.sectionLabel}>Selected Task Detail</label>
            {mode === 'PICK' ? (
              <div className={`${styles.infoBox} ${styles.disabledState}`}>
                <FileText size={18} className={styles.emerald} />
                <div className={styles.infoContent}>
                  <p className={styles.infoTitle}>{selectedTask || 'Routine Audit'}</p>
                  <span className={styles.infoSub}>Assigned Task (Read-Only)</span>
                </div>
                <CheckCircle2 size={16} className={styles.emerald} style={{ marginLeft: 'auto' }} />
              </div>
            ) : (
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                <div 
                  className={`${styles.selectTrigger} ${dropdownOpen ? styles.active : ''}`} 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className={selectedTask ? styles.black : styles.dim}>
                    {selectedTask || 'Choose a task from list...'}
                  </span>
                  <ChevronDown size={18} className={dropdownOpen ? styles.rotate : ''} />
                </div>
                {dropdownOpen && (
                  <div className={styles.floatingMenu}>
                    {TASK_LIST.map(item => (
                      <div key={item} className={styles.menuOption} onClick={() => { setSelectedTask(item); setDropdownOpen(false); }}>
                        {item} {selectedTask === item && <CheckCircle2 size={16} color="#286c1b" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: IMAGES UPLOAD */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.headerTitle}><ImageIcon size={18}/> Photos <span className={styles.limitTag}>(Max 5)</span></div>
              <span className={styles.countBadge}>{images.length}/5</span>
            </div>
            
            <div className={styles.mediaGrid}>
              {images.map((img, i) => (
                <div key={`img-${i}`} className={styles.mediaBox}>
                  <img src={img} alt="proof" />
                  <button onClick={() => removeMedia(i, 'img')} className={styles.deleteIcon} aria-label="Remove image">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button className={styles.uploadPlaceholder} onClick={() => imageInputRef.current.click()}>
                  <Plus size={24} />
                  <span>Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 3: VIDEOS UPLOAD */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.headerTitle}><VideoIcon size={18}/> Video Proof <span className={styles.limitTag}>(Max 2)</span></div>
              <span className={styles.countBadge}>{videos.length}/2</span>
            </div>
            
            <div className={styles.mediaGrid}>
              {videos.map((vid, i) => (
                <div key={`vid-${i}`} className={styles.mediaBox}>
                  <video src={`${vid}#t=0.5`} preload="metadata" muted />
                  <div className={styles.playCenter}><PlayCircle size={24} color="white" /></div>
                  <button onClick={() => removeMedia(i, 'vid')} className={styles.deleteIcon} aria-label="Remove video">
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}
              {videos.length < 2 && (
                <button className={styles.uploadPlaceholder} onClick={() => videoInputRef.current.click()}>
                  <UploadCloud size={24} />
                  <span>Upload</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 4: REMARKS */}
          <div className={styles.card}>
            <label className={styles.sectionLabel}>Remarks</label>
            <textarea 
              className={styles.textArea} 
              placeholder="Type your observations or task completion status here..." 
              value={remark} 
              onChange={(e) => setRemark(e.target.value)} 
            />
          </div>
        </div>

        <div className={styles.footerAction}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!selectedTask}>Submit</button>
        </div>

        <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFileUpload(e, 'img')} />
        <input ref={videoInputRef} type="file" accept="video/*" multiple hidden onChange={(e) => handleFileUpload(e, 'vid')} />
      </div>
    </div>
  );
};

export default KpiTaskExecutionForm;