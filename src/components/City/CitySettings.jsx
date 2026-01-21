import { useState, useEffect } from "react";
// import style from '../../MobileAppPages/Tasks/Styles/HistoryData/HistoryData.module.css';
import style from "./CitySettings.module.css";
import { Edit2, Database, Save, X } from "lucide-react";
import LogoImage from "../Common/Image/LogoImage";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GlobalAlertModal from "../GlobalAlertModal/GlobalAlertModal";
import GlobalSpinnerLoader from "../Common/Loader/GlobalSpinnerLoader";

const CitySettings = ({
  openCanvas,
  onHide,
  selectedCity,
  onClickEdit,
  setStatusConfirmation,
  onSaveFirebaseConfig,
}) => {
  const [toggle, setToggle] = useState(
    selectedCity?.status === "active" || false,
  );
  const [dbUrl, setDbUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (selectedCity?.firebase_db_path) {
      setDbUrl(selectedCity.firebase_db_path);
    } else {
      setDbUrl("");
    }
    setToggle(selectedCity?.status === "active" || false);
  }, [selectedCity]);

  const handleToggle = (e) =>
    setStatusConfirmation({ status: true, data: e.target.checked, setToggle });

  const handleSave = () => {
    // Validation
    if (!dbUrl?.trim()) {
      setError("Database URL is required");
      return;
    }

    try {
      const url = new URL(dbUrl);
      if (!url.hostname.endsWith("firebaseio.com")) {
        setError("Invalid URL. Must be a valid 'firebaseio.com' URL");
        return;
      }
    } catch (_) {
      setError("Invalid URL format");
      return;
    }

    // Check if updating existing URL
    if (selectedCity?.firebase_db_path) {
      setShowConfirmModal(true);
    } else {
      // First time save - direct
      onSaveFirebaseConfig(dbUrl, setLoading);
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    onSaveFirebaseConfig(dbUrl, setLoading);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${style.backdrop} ${openCanvas ? style.show : ""}`}
        onClick={onHide}
      />

      {/* Offcanvas Panel */}
      <div className={`${style.offcanvas} ${openCanvas ? style.open : ""}`}>
        <div className={style.OffcanvasHeader}>
          <div className={style.OffcanvasHeaderTitle}>City Settings</div>
          <button className={style.closeBtn} onClick={onHide}>
            <X size={20} />
          </button>
        </div>

        <div className={style.OffcanvasBody}>
          {/* City Info */}
          <div className={style.cityCard}>
            <div className={style.cityCardLeft}>
              <LogoImage image={selectedCity?.logoUrl} />
              <div className={style.cityName}>
                {selectedCity?.city_name || "N/A"}
              </div>
            </div>
            <div className={style.cityCardRight}>
              <div
                className={`${style.activeInactiveBadge} ${
                  toggle ? style.badgeActive : style.badgeInactive
                }`}
                onClick={() =>
                  setStatusConfirmation({
                    status: true,
                    data: !toggle, // toggle flip
                    setToggle,
                  })
                }
              >
                {toggle ? "Deactivate" : "Activate"}
              </div>

              <button
                className={style.editIcon}
                onClick={onClickEdit}
                title="Edit City"
              >
                <Edit2 size={14} />
              </button>

              {/* <div className={style.statusSection}>
                <label className={style.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={toggle}
                    onChange={handleToggle}
                  />
                  <span className={style.toggleSlider}></span>
                </label>
                <span
                  className={`${style.statusText} ${
                    toggle ? style.active : style.inactive
                  }`}
                >
                  {toggle ? "Active" : "Inactive"}
                </span>
              </div> */}
            </div>
          </div>

          {/* Firebase Section */}
          <div className={style.firebaseCard}>
            <div className={style.inputGroup}>
              <div className={style.labelRow}>
                <Database size={14} />
                <label className={style.labelText}>
                  Firebase Database Path
                </label>
              </div>

              <div className={style.inputWrapper}>
                <input
                  type="text"
                  value={dbUrl}
                  onChange={(e) => {
                    setDbUrl(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Enter Database URL"
                  className={style.firebaseInput}
                />

                <button
                  className={style.btnSave}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <GlobalSpinnerLoader /> : <Save size={16} />}
                </button>
              </div>

              {error && <ErrorMessage message={error} />}
            </div>
          </div>
        </div>

        <GlobalAlertModal
          show={showConfirmModal}
          iconType="success"
          title="Update Firebase URL?"
          message={`Are you sure you want to change the Firebase Database Path ${dbUrl}`}
          buttonText="Yes, Update"
          cancelText="Cancel"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmModal(false)}
          btnColor="#f57c00"
        />
      </div>
    </>
  );
};

export default CitySettings;
