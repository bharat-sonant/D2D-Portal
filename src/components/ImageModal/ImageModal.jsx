import React, { useEffect } from "react";
import style from "./ImageModal.module.css";

const ImageModal = ({ imageUrl, title, onClose }) => {

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!imageUrl) return null;

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                
                {/* ⭐ Title */}
                <h3 className={style.modalTitle}>{title}</h3>

                <img src={imageUrl} alt="Preview" className={style.modalImage} />

                <button className={style.closeBtn} onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default ImageModal;
