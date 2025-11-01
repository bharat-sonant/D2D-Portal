import React, { useRef, useState, useEffect } from "react";
import styles from "../../src/assets/css/Camera/Camera.module.css";
import { FaSpinner } from "react-icons/fa";
import modalStyles from "../../src/assets/css/modal.module.css";
import { images } from "../../src/assets/css/imagePath.js";

const FaceVerificationCamera = ({
  onClose,
  onCapture,
  setIsCameraVisible,
  loading,
  title,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);

  useEffect(() => {
    let stream = null;

    const openCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);

        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
        setIsCameraVisible(true);
        onClose();
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setIsCameraVisible, onClose]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 300; // Rectangle Shape

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        video,
        (video.videoWidth - canvas.width) / 2,
        (video.videoHeight - canvas.height) / 2,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageDataUrl = canvas.toDataURL("image/png");
      onCapture(imageDataUrl);
      handleCloseCamera();
    }
  };

  const handleCloseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className={`${modalStyles.overlay}`}>
      <div
        className={`${modalStyles.modal} ${modalStyles.modalFaceVerification}`}
      >
        <div className={`${modalStyles.actionBtn}`}>
          <p className={`${modalStyles.headerText}`}>{title}</p>
          <button
            className={`${modalStyles.closeBtn}`}
            onClick={handleCloseCamera}
          >
            <img
              src={images.iconClose}
              className={`${modalStyles.iconClose}`}
              title="Close"
              alt="icon"
            />
          </button>
        </div>
        <div className={`${modalStyles.modalBody}`}>
          <div className={`row`}>
            <div className={`col-md-12`}>
              <div className={`${styles.videoContainerhide}`}>
                <div
                  className={`${styles.videoContainer} ${styles.videoFaceContainer}`}
                >
                  <div className={`${styles.modalLoader}`}>
                    <video
                      ref={videoRef}
                      autoPlay
                      className={`${styles.video}`}
                      onLoadedMetadata={() => setIsCameraLoading(false)}
                      style={{ display: isCameraLoading ? "none" : "block" }}
                    ></video>
                  </div>
                  {/* Blurred overlay */}
                  <div className={`${styles.blurOverlay}`}></div>

                  {/* Transparent 300x300 Rectangle */}
                  <div className={`${styles.cameraOutline}`}>
                    <div className={`${styles.clearRectangle}`}></div>
                  </div>
                </div>
                <div className={`${styles.cameraFooter}`}>
                  <div className={styles.cameraFooterTitle}>
                    Face Verification
                  </div>
                  <div className={`${styles.cameraFooterMsg}`}>
                    Please align your face within the camera frame.
                  </div>
                </div>
              </div>

              <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>
              {loading ? (
                <div className={`${styles.Loginloadercontainer}`}>
                  <FaSpinner className={`${styles.spinnerLogin}`} />
                  <span className={`${styles.loaderText}`}>Please wait...</span>
                </div>
              ) : (
                <div className={`${styles.buttonContainer} ${styles.btnTOP}`}>
                  <button
                    onClick={captureImage}
                    className={modalStyles.btnSave}
                    disabled={isCameraLoading} // Disable capture while loading
                  >
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

export default FaceVerificationCamera;

// import React, { useRef, useState, useEffect } from "react";
// import styles from "../../src/assets/css/Camera/Camera.module.css";
// import { FaSpinner } from "react-icons/fa";
// import modalStyles from "../../src/assets/css/modal.module.css";
// import { images } from "../../src/assets/css/imagePath.js";

// const FaceVerificationCamera = ({
//   onClose,
//   onCapture,
//   setIsCameraVisible,
//   loading,
//   title,
// }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [cameraStream, setCameraStream] = useState(null);

//   useEffect(() => {
//     let stream = null;

//     const openCamera = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setCameraStream(stream);

//         if (videoRef.current && !videoRef.current.srcObject) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//         setIsCameraVisible(true);
//         onClose();
//       }
//     };

//     openCamera();

//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [setIsCameraVisible, onClose]);

//   const captureImage = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     if (canvas && video) {
//       const context = canvas.getContext("2d");
//       canvas.width = 300;
//       canvas.height = 300; // Rectangle Shape

//       context.clearRect(0, 0, canvas.width, canvas.height);
//       context.drawImage(
//         video,
//         (video.videoWidth - canvas.width) / 2,
//         (video.videoHeight - canvas.height) / 2,
//         canvas.width,
//         canvas.height,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       const imageDataUrl = canvas.toDataURL("image/png");
//       onCapture(imageDataUrl);
//       handleCloseCamera();
//     }
//   };

//   const handleCloseCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//     }
//     onClose();
//   };

//   return (
//     <div className={modalStyles.overlay}>
//       <div className={`${modalStyles.modal}`}>
//         <div className={`${modalStyles.actionBtn}`}>
//           <p className={modalStyles.headerText}>{title}</p>
//           <button
//             className={`${modalStyles.closeBtn}`}
//             onClick={handleCloseCamera}
//           >
//             <img
//               src={images.iconClose}
//               className={`${modalStyles.iconClose}`}
//               title="Close"
//               alt="icon"
//             />
//           </button>
//         </div>
//         <div className={`${modalStyles.modalBody}`}>
//           <div className={`row`}>
//             <div className={`col-md-12`}>
//               <div className={styles.videoContainer}>
//                 <div className={styles.cameraOutline}>
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     className={`${styles.video} ${styles.faceVerificationCamera}`}
//                   ></video>
//                 </div>
//               </div>

//               <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>
//               {loading ? (
//                 <div className={styles.Loginloadercontainer}>
//                   <FaSpinner className={styles.spinnerLogin} />
//                   <span className={styles.loaderText}>Please wait...</span>
//                 </div>
//               ) : (
//                 <div className={styles.buttonContainer}>
//                   <button
//                     onClick={captureImage}
//                     className={modalStyles.btnSave}
//                   >
//                     Capture Image
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceVerificationCamera;

// import React, { useRef, useState, useEffect } from "react";
// import styles from "../../src/assets/css/Camera/Camera.module.css";
// import { FaSpinner } from "react-icons/fa";

// //  CSS Import here
// import modalStyles from "../../src/assets/css/modal.module.css";
// import { images } from "../../src/assets/css/imagePath.js";

// const FaceVerificationCamera = ({ onClose, onCapture, setIsCameraVisible, loading, title }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [cameraStream, setCameraStream] = useState(null);

//   useEffect(() => {
//     let stream = null;

//     const openCamera = async () => {
//       try {
//         // Check if the Permissions API is available
//         if (navigator.permissions) {
//           const permissionStatus = await navigator.permissions.query({
//             name: "camera",
//           });

//           if (permissionStatus.state === "denied") {
//             console.warn(
//               "Camera access is denied. Please allow it in browser settings."
//             );
//             onClose();
//             setIsCameraVisible(true);
//             return;
//           }
//         }

//         // Request camera access
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setCameraStream(stream);

//         if (videoRef.current && !videoRef.current.srcObject) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Error accessing the camera:", error);
//         setIsCameraVisible(true);
//         onClose();
//       }
//     };

//     openCamera();

//     return () => {
//       // Cleanup camera stream on unmount
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, [setIsCameraVisible, onClose]);

//   const captureImage = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     if (canvas && video) {
//       const context = canvas.getContext("2d");
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const imageDataUrl = canvas.toDataURL("image/png");

//       onCapture(imageDataUrl); // Pass captured image back to parent

//       // Close the camera after capturing the image
//       handleCloseCamera();
//     }
//   };

//   const handleCloseCamera = () => {
//     // Stop the camera stream
//     if (cameraStream) {
//       const tracks = cameraStream.getTracks();
//       tracks.forEach((track) => track.stop());
//     }
//     onClose();
//   };

//   return (
//     <div className={modalStyles.overlay}>
//       <div className={`${modalStyles.modal}`}>
//         <div className={`${modalStyles.actionBtn}`}>
//           <p className={modalStyles.headerText}>{title}</p>
//           <button
//             className={`${modalStyles.closeBtn}`}
//             onClick={handleCloseCamera}
//           >
//             <img
//               src={images.iconClose}
//               className={`${modalStyles.iconClose}`}
//               title="Close"
//               alt="icon"
//             />
//           </button>
//         </div>
//         <div className={`${modalStyles.modalBody}`}>
//           <div className={`row`}>
//             <div className={`col-md-12`}>
//               <div className={`${styles.videoContainer} ${styles.faceContainer}`}>
//                 <div className={styles.cameraOutline}>
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     className={`${styles.video} ${styles.faceVerificationCamera}`}
//                   ></video>
//                 </div>

//                 <div className={styles.cameraFooter}>
//                   <div className={styles.cameraFooterTitle}>
//                     Face Verification
//                   </div>
//                   <div className={styles.cameraFooterMsg}>
//                   Please align your face within the camera frame.
//                   </div>
//                 </div>
//               </div>
//               <canvas ref={canvasRef} className={styles.hiddenCanvas}></canvas>
//               {loading ? (
//                 <div className={styles.Loginloadercontainer}>
//                   <FaSpinner className={styles.spinnerLogin} />
//                   <span className={styles.loaderText}>Please wait...</span>
//                 </div>
//               ) : (
//                 <div className={styles.buttonContainer}>
//                   <button
//                     onClick={captureImage}
//                     className={modalStyles.btnSave}
//                   >
//                     Capture Image
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceVerificationCamera;
