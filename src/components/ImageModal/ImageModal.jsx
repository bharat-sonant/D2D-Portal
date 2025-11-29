import React, { useEffect, useState } from "react";
import style from "./ImageModal.module.css";
import { FaTimes, FaDownload, FaExpand, FaCompress, FaSearchPlus, FaSearchMinus, FaCamera } from "react-icons/fa";

const ImageModal = ({ imageUrl, title, onClose }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title || "image"}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const resetZoom = () => {
        setZoom(1);
    };

    if (!imageUrl) return null;

    return (
        <div className={style.modalOverlay} onClick={onClose}>
            <div
                className={`${style.modalContent} ${isFullscreen ? style.fullscreen : ''}`}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className={style.modalHeader}>
                    <div className={style.titleSection}>
                        <div className={style.titleIcon}><FaCamera /></div>
                        <h3 className={style.modalTitle}>{title}</h3>
                    </div>

                    <div className={style.headerActions}>
                        {/* Zoom Controls */}
                        <div className={style.zoomControls}>
                            <button
                                className={style.iconBtn}
                                onClick={handleZoomOut}
                                disabled={zoom <= 0.5}
                                title="Zoom Out"
                            >
                                <FaSearchMinus />
                            </button>
                            <span className={style.zoomLevel}>{Math.round(zoom * 100)}%</span>
                            <button
                                className={style.iconBtn}
                                onClick={handleZoomIn}
                                disabled={zoom >= 3}
                                title="Zoom In"
                            >
                                <FaSearchPlus />
                            </button>
                            {zoom !== 1 && (
                                <button
                                    className={`${style.iconBtn} ${style.resetBtn}`}
                                    onClick={resetZoom}
                                    title="Reset Zoom"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Download Button */}
                        <button
                            className={`${style.iconBtn} ${style.downloadBtn}`}
                            onClick={handleDownload}
                            title="Download Image"
                        >
                            <FaDownload />
                        </button>

                        {/* Fullscreen Toggle */}
                        <button
                            className={style.iconBtn}
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>

                        {/* Close Button */}
                        <button
                            className={`${style.iconBtn} ${style.closeBtnHeader}`}
                            onClick={onClose}
                            title="Close (ESC)"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div className={style.imageContainer}>
                    {!imageLoaded && (
                        <div className={style.imageLoader}>
                            <div className={style.spinner}></div>
                            <p>Please wait... Loading image</p>
                        </div>
                    )}
                    <img
                        src={imageUrl}
                        alt={title || "Preview"}
                        className={style.modalImage}
                        style={{
                            transform: `scale(${zoom})`,
                            opacity: imageLoaded ? 1 : 0
                        }}
                        onLoad={() => setImageLoaded(true)}
                        onDoubleClick={resetZoom}
                    />
                </div>

                {/* Footer Info */}
                <div className={style.modalFooter}>
                    <span className={style.footerHint}>💡 Double-click image to reset zoom | Press ESC to close</span>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;