import { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import style from '../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css';
import { Edit2, Flame, Save } from 'lucide-react';
import { images } from '../../assets/css/imagePath';
import LogoImage from '../Common/Image/LogoImage';
import { FaSpinner } from "react-icons/fa";

import * as common from "../../common/common";

const CitySettings = ({
  openCanvas,
  onHide,
  selectedCity,
  onClickEdit,
  setStatusConfirmation,
  onSaveFirebaseConfig
}) => {
  const [toggle, setToggle] = useState(selectedCity?.status === 'active' || false);
  const [dbUrl, setDbUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCity?.firebase_db_path) {
      setDbUrl(selectedCity.firebase_db_path);
    } else {
      setDbUrl('');
    }
    setToggle(selectedCity?.status === 'active' || false);
  }, [selectedCity]);

  const handleToggle = (e) =>
    setStatusConfirmation({ status: true, data: e.target.checked, setToggle });

  const handleSave = () => {
    // Validation
    if (!dbUrl) {
      common.setAlertMessage("error", "Database URL is required");
      return;
    }

    try {
      const url = new URL(dbUrl);
      if (!url.hostname.includes('firebaseio.com')) {
        common.setAlertMessage("error", "Invalid URL. Must contain 'firebaseio.com'");
        return;
      }
    } catch (_) {
      common.setAlertMessage("error", "Invalid URL format");
      return;
    }

    // Save simple string
    onSaveFirebaseConfig(dbUrl, setLoading);
  };

  return (
    <Offcanvas
      placement="end"
      show={openCanvas}
      onHide={onHide}
      className={style.responsiveOffcanvas}
      style={{ width: '45%' }}
    >
      <div className={style.canvas_container}>
        <div className={style.OffcanvasHeader}>
          <h4 className={style.header_title}>City Settings</h4>
        </div>

        <div className={style.scroll_section}>
          <div className={style.canvas_header_end}>
            <img
              src={images.iconClose}
              className={style.close_popup}
              onClick={onHide}
              alt="Close"
            />
          </div>

          {/* City Info */}
          <div className={style.taskControlCard}>
            <div className={style.controlRow}>
              <LogoImage image={selectedCity?.logoUrl} />
              <h3 className={style.taskName}>
                {selectedCity?.city_name || 'N/A'}
              </h3>

              <div className={style.actionButtons}>
                <button
                  className={style.editButton}
                  onClick={onClickEdit}
                  title="Edit City"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              <div className={style.statusSection}>
                <label className={style.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={toggle}
                    onChange={handleToggle}
                  />
                  <span className={style.toggleSlider}></span>
                </label>
                <span
                  className={`${style.statusText} ${toggle ? style.active : style.inactive
                    }`}
                >
                  {toggle ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* 🔥 New Column : Firebase Connectivity */}
          <div className={style.taskControlCard}>
            <div className={style.controlRow} style={{ alignItems: 'center', gap: '10px' }}>
              <Flame size={20} className={style.icon} style={{ color: '#f57c00' }} />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#555' }}>Firebase Database Path</label>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => setDbUrl(e.target.value)}
                  placeholder="Enter Database URL"
                  className="form-control"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <button
                className={style.editButton}
                onClick={handleSave}
                title="Save Firebase Config"
                disabled={loading}
                style={{ marginTop: '20px' }}
              >
                {loading ? <FaSpinner className="fa-spin" /> : <Save size={18} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Offcanvas>
  );
};

export default CitySettings;
