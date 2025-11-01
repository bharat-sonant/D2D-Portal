import React, { useState, useEffect, useRef } from "react";
import { images } from "../assets/css/imagePath";
import styles from '../assets/css/modal.module.css';
import attachementStyles from '../assets/css/TaskDetails/ShowAttachmentWindow.module.css';
import globleStyles from '../assets/css/globleStyles.module.css';
import { PulseLoader } from "react-spinners";

const defaultImage = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg";

const DualImageViewer = ({ files = [], isOpen, onClose, loading, setLoading, selectedFileName }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    // const [isLoading, setIsLoading] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const fileObj = files[currentIndex];
    const file = typeof fileObj === "string" ? fileObj : fileObj?.imageUri || ""; // Adjust based on your data shape

    const hasFiles = file && file.length > 0;

    useEffect(() => {
        setLoading(true);
        if (files) {
            setTimeout(() => {
                setLoading(false);
                // setIsLoading(false);
            }, 1000);
        }
    }, [file]);

    const handleNext = () => {
        if (hasFiles) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
        }
    };

    const handlePrev = () => {
        if (hasFiles) {
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? files.length - 1 : prevIndex - 1));
        }
    };

    const handleDownloadFile = async () => {
        try {
            const response = await fetch(file);
            const contentDisposition = response.headers.get("content-disposition");
            let fileName = "downloaded-file.zip";

            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) {
                    fileName = matches[1];
                }
            } else {
                const urlObj = new URL(file);
                fileName = decodeURIComponent(urlObj.pathname.split("/").pop());
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");

            anchor.href = url;
            anchor.setAttribute("download", fileName);
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("File download failed:", error);
        }
    };

    const handleRotate = () => setRotation((prev) => prev + 90);
    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - startPosition.x, y: e.clientY - startPosition.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (!isOpen) return null;

    return (
        <div
            className={styles.overlay}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className={`${styles.modal} ${attachementStyles.modal}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.actionBtn}>
                    <div className={`${attachementStyles.actionBtnLeft}`}>
                        <p className={styles.headerText}>
                            {(fileObj?.isScreenShot === "Yes" || fileObj?.isScreenShot === true)
                                ? "PaymentScreenShot.jpg"
                                : (fileObj?.imageId && fileObj?.type
                                    ? `${fileObj.imageId}${fileObj.type}`  // Combine imageId and type to create filename
                                    : "Attachment Preview")}
                        </p>
                    </div>

                    <div className={`${attachementStyles.actionBtnCenter}`}>
                        <div className={`${attachementStyles.zoomInOutBg}`}>
                            <img
                                src={images.iconZoomOut}
                                className={`${attachementStyles.iconZoom}`}
                                title="Zoom Out"
                                alt="icon"
                                onClick={handleZoomOut}
                            />
                            <div className={`${styles.zoomInOutText}`}>{Math.round(scale * 100)}%</div>
                            <img
                                src={images.iconZoomIn}
                                className={`${attachementStyles.iconZoom}`}
                                title="Zoom In"
                                alt="icon"
                                onClick={handleZoomIn}
                            />
                        </div>
                    </div>

                    <div className={`${attachementStyles.actionBtnRight}`}>
                        {!isPreviewMode && file && !file.includes(".pdf") && (
                            <img
                                src={images.iconRotate}
                                className={`${attachementStyles.iconRotate}`}
                                title="Rotate"
                                alt="icon"
                                onClick={handleRotate}
                            />
                        )}
                        {!isPreviewMode && file && !file.includes(".pdf") && (
                            <img
                                src={images.iconDownload}
                                className={`${attachementStyles.iconDownload}`}
                                title="Download"
                                alt="icon"
                                onClick={handleDownloadFile}
                            />
                        )}
                        <button className={styles.closeBtn} onClick={onClose}>
                            <img
                                src={images.iconClose}
                                className={styles.iconClose}
                                title="Close"
                                alt="Close Icon"
                            />
                        </button>
                    </div>
                </div>

                {files.length > 1 && (
                    <div className={attachementStyles.imageBtn}>
                        {currentIndex > 0 ? (
                            <button className={`btn ${attachementStyles.BtnPrev}`}
                                onClick={handlePrev}
                            >
                                <img
                                    src={images.iconLeft}
                                    className={attachementStyles.prev}
                                    title="Prev"
                                    alt="Prev"
                                />
                            </button>
                        ) : (
                            <div style={{ width: '80px' }}></div>
                        )}

                        {currentIndex < files.length - 1 ? (
                            <button className={`btn ${attachementStyles.BtnNext}`}
                                onClick={handleNext} >
                                <img
                                    src={images.iconRight}
                                    className={attachementStyles.next}
                                    title="Next"
                                    alt="Next"
                                />
                            </button>
                        ) : (
                            <div style={{ width: '80px' }}></div>
                        )}
                    </div>
                )}


                <div className={`${styles.modalBody} ${styles.modalBodyAttachements}`}>
                    <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                        <div className={`${attachementStyles.filePreviewBox} ${file.match(".pdf") ? attachementStyles.pdfPreviewBox : ""}`}>
                            {loading || files.length === 0 ? (
                                <div className={attachementStyles.loaderContainer}>
                                    <PulseLoader color="#3fb2f1" size={11} />
                                    <div className={`${globleStyles.loaderText}`}>Loading file, Please wait</div>
                                </div>
                            ) : (
                                <div
                                    ref={imageRef}
                                    className={`${attachementStyles.previewContainer} 
                                    ${file.match(".mp4") ? attachementStyles.videoPreview : ""} 
                                    ${file.match(".pdf") ? attachementStyles.pdfPreview : ""}`}
                                    onMouseDown={handleMouseDown}
                                    style={{
                                        transform: `rotate(${rotation}deg) scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                        cursor: isDragging ? "grabbing" : "grab",
                                    }}
                                >
                                    {fileObj?.type === ".jpg" ? (
                                        <img src={file} alt="Preview" className={styles.previewImage} />
                                    ) : fileObj?.type === ".pdf" ? (
                                        <iframe src={file} width="100%" style={{ height: `calc(100vh - 250px)` }} />
                                    ) : fileObj?.type === "video" ? (
                                        <video controls width="100%" style={{ height: `calc(100vh - 250px)` }}>
                                            <source src={file} type="video/mp4" />
                                        </video>
                                    ) : fileObj?.type === "excel" ? (
                                        <div className={`${attachementStyles.fileMessageRow}`}>
                                            <p className={`${attachementStyles.fileMessage}`}>Excel file detected. Click below to download</p>
                                            <button className={`btn ${attachementStyles.btnDownload}`} onClick={handleDownloadFile}>
                                                Download File
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={`${attachementStyles.fileMessage}`}>
                                            Cannot preview this file type. Click download to view it.
                                        </p>
                                    )}

                                </div>
                            )}
                        </div>

                        <div className={`${attachementStyles.filePreviewBox} ${file.match(".pdf") ? attachementStyles.pdfPreviewBox : ""}`}>
                            {loading || files.length === 0 ? (
                                <div className={attachementStyles.loaderContainer}>
                                    <PulseLoader color="#3fb2f1" size={11} />
                                    <div className={`${globleStyles.loaderText}`}>Loading file, Please wait</div>
                                </div>
                            ) : (
                                <div
                                    ref={imageRef}
                                    className={`${attachementStyles.previewContainer} 
                                    ${file.match(".mp4") ? attachementStyles.videoPreview : ""} 
                                    ${file.match(".pdf") ? attachementStyles.pdfPreview : ""}`}
                                    onMouseDown={handleMouseDown}
                                    style={{
                                        transform: `rotate(${rotation}deg) scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                        cursor: isDragging ? "grabbing" : "grab",
                                    }}
                                >
                                    {fileObj?.type === ".jpg" ? (
                                        <img src={file} alt="Preview" className={styles.previewImage} />
                                    ) : fileObj?.type === ".pdf" ? (
                                        <iframe src={file} width="100%" style={{ height: `calc(100vh - 250px)` }} />
                                    ) : fileObj?.type === "video" ? (
                                        <video controls width="100%" style={{ height: `calc(100vh - 250px)` }}>
                                            <source src={file} type="video/mp4" />
                                        </video>
                                    ) : fileObj?.type === "excel" ? (
                                        <div className={`${attachementStyles.fileMessageRow}`}>
                                            <p className={`${attachementStyles.fileMessage}`}>Excel file detected. Click below to download</p>
                                            <button className={`btn ${attachementStyles.btnDownload}`} onClick={handleDownloadFile}>
                                                Download File
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={`${attachementStyles.fileMessage}`}>
                                            Cannot preview this file type. Click download to view it.
                                        </p>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                    {/*  */}
                </div>
            </div>
        </div>
    );
};

export default DualImageViewer;

