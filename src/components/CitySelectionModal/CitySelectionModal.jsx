import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, AlertCircle } from "lucide-react";
import styles from "./CitySelectionModal.module.css";

/**
 * CitySelectionModal
 *
 * Props:
 *  open          – boolean
 *  onClose       – () => void
 *  onSelect      – (cityName: string) => void
 *  cityList      – string[]  (city names)
 *  title         – string   (default "Select City")
 *  infoMessage   – string   (plain text, shown in the orange banner)
 *  boldWord      – string   (word inside infoMessage that should be bold)
 *  selectedCity  – string   (currently selected city, optional)
 */    
const CitySelectionModal = ({
  open,
  onClose,
  onSelect,
  cityList = [],
  title = "Select City",
  infoMessage = "",
  boldWord = "",
  selectedCity = "",
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return cityList;
    return cityList.filter((c) =>
      c.toLowerCase().includes(query.toLowerCase())
    );
  }, [cityList, query]);

  /** Render infoMessage with boldWord highlighted */
  const renderInfoMessage = () => {
    if (!boldWord || !infoMessage.includes(boldWord)) return infoMessage;
    const parts = infoMessage.split(boldWord);
    return (
      <>
        {parts[0]}
        <strong>{boldWord}</strong>
        {parts[1]}
      </>
    );
  };

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Info Banner ── */}
        {infoMessage && (
          <div className={styles.infoBanner}>
            <AlertCircle size={15} className={styles.infoIcon} />
            <p className={styles.infoText}>{renderInfoMessage()}</p>
          </div>
        )}

        {/* ── Search ── */}
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
        </div>

        {/* ── City Chips ── */}
        <div className={styles.body}>
          {filtered.length === 0 ? (
            <p className={styles.noResult}>No cities found</p>
          ) : (
            <div className={styles.chipsWrap}>
              {filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`${styles.chip} ${
                    selectedCity?.toLowerCase() === city.toLowerCase()
                      ? styles.chipActive
                      : ""
                  }`}
                  onClick={() => onSelect(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CitySelectionModal;
