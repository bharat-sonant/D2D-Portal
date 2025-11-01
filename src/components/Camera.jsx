import React, { useRef, useState, useEffect } from "react";
import styles from "../../src/assets/css/Camera/Camera.module.css";
import { FaSpinner } from "react-icons/fa";
import modalStyles from "../../src/assets/css/modal.module.css";
import { images } from "../../src/assets/css/imagePath.js";

const Camera = ({ onClose, onCapture, setIsCameraVisible, loading, title }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const openCamera = async () => {
    setErrorMessage("");
    let stream = null;

    try {
      // Check permissions if supported
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "camera" });
  
          if (permissionStatus.state === "denied") {
            setErrorMessage("Camera access is denied in browser settings.");
            setIsCameraVisible(true);
            onClose();
            return;
          }
        } catch {
          // Continue if the permission API is not fully supported
        }
      }
      const constraints = { video: true, audio: false };

      if (navigator.mediaDevices?.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } else if (navigator.getUserMedia) {
        
        stream = await new Promise((resolve, reject) =>
          navigator.getUserMedia(constraints, resolve, reject)
        );
      } else if (navigator.webkitGetUserMedia) {
      
        stream = await new Promise((resolve, reject) =>
          navigator.webkitGetUserMedia(constraints, resolve, reject)
        );
      } else if (navigator.mozGetUserMedia) {
       
        stream = await new Promise((resolve, reject) =>
          navigator.mozGetUserMedia(constraints, resolve, reject)
        );
      } else {
        console.log("Camera API not supported by this browser.");
      }
    
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setErrorMessage("Unable to access camera. Please check browser permissions.");
      setIsCameraVisible(true);
      onClose();
    }
  };


  const stopCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    openCamera();
    return () => stopCamera();
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");

      onCapture(imageDataUrl);
      handleCloseCamera();
    }
  };

  const handleCloseCamera = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.modal} ${modalStyles.modalCamera}`}>
        <div className={modalStyles.actionBtn}>
          <p className={modalStyles.headerText}>{title}</p>
          <button className={modalStyles.closeBtn} onClick={handleCloseCamera}>
            <img src={images.iconClose} className={modalStyles.iconClose} alt="Close" />
          </button>
        </div>

        <div className={modalStyles.modalBody}>
          <div className="row">
            <div className="col-md-12">
              <div className={styles.videoContainer}>
                <video ref={videoRef} autoPlay className={styles.video}></video>
                <img src={images.iconScanView} className={styles.iconScanner} alt="scan" />
              </div>

              <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>

              {errorMessage && (
                <div className={styles.errorMsg}>
                  <span>⚠️ {errorMessage}</span>
                </div>
              )}

              {loading ? (
                <div className={styles.Loginloadercontainer}>
                  <FaSpinner className={styles.spinnerLogin} />
                  <span className={styles.loaderText}>Please wait...</span>
                </div>
              ) : (
                <div className={styles.buttonContainer}>
                  <button onClick={captureImage} className={modalStyles.btnSave}>
                    Capture Image
                  </button>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
