import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, X, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCityList } from "../../../Action/D2DMonitoring/Monitoring/WardListAction";
import styles from "./CityPickerModal.module.css";

/** First 2 letters of a city name for the avatar fallback */
const getInitials = (name = "") =>
  name.trim().slice(0, 2).toUpperCase();

const CityPickerModal = ({ currentCity, onClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCityList()
      .then(setCityList)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSelect = (item) => {
    onClose();
    // Replace the city segment in the current path, keep the rest as-is
    // e.g. /Jaipur/d2dMonitoring/db-service-tracking → /Sikar/d2dMonitoring/db-service-tracking
    const newPath = pathname.replace(/^\/[^/]+/, `/${item.cityName}`);
    navigate(newPath);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap}>
              <MapPin size={22} />
            </div>
            <div>
              <h2 className={styles.title}>Select City</h2>
              <p className={styles.subtitle}>Choose your preferred site location</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Loading cities…</span>
            </div>
          ) : cityList.length === 0 ? (
            <div className={styles.empty}>
              <p>No cities found</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {cityList.map((item) => {
                const isActive =
                  item.cityName?.toLowerCase() === currentCity?.toLowerCase();
                return (
                  <div
                    key={item.cityName}
                    className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                    onClick={() => handleSelect(item)}
                  >
                    {/* Logo / initials avatar */}
                    {item.logoUrl ? (
                      <div className={styles.logoWrap}>
                        <img
                          src={item.logoUrl}
                          alt={item.cityName}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    ) : (
                      <div className={styles.initialsWrap}>
                        {getInitials(item.cityName)}
                      </div>
                    )}

                    <span className={styles.name}>{item.cityName}</span>

                    {isActive && (
                      <div className={styles.checkBadge}>
                        <Check size={9} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CityPickerModal;
