// export const FileUploadBox = ({ label, handleGeoJsonUpload }) => {
//   return (
//     <div
//       style={{
//         border: "2px dashed #9ca3af",
//         borderRadius: "10px",
//         padding: "18px",
//         textAlign: "center",
//         cursor: "pointer",
//         background: "#f9fafb",
//         position: "relative",
//       }}
//       onClick={() => document.getElementById(label).click()}
//     >
//       <input
//         id={label}
//         type="file"
//         onChange={handleGeoJsonUpload}
//         style={{ display: "none" }}
//       />

//       <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
//         {label}
//       </div>

//       <div style={{ fontSize: "12px", color: "#6b7280" }}>
//         Click to upload (.geojson, .kml)
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import { Upload } from "lucide-react";
import styles from "./FileUploadBox.module.css";

export const FileUploadBox = ({ id, label, onChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "json") {
      alert("Only .json files are allowed");
      return;
    }

    onChange(e); // tumhara existing popup + confirmation yahin se trigger hoga
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      };
      handleFileChange(fakeEvent);
    }
  };

  return (
    <div className={styles.uploadWrapper}>
      {/* Hidden Input */}
      <input
        type="file"
        id={id}
        className={styles.fileInput}
        accept=".json"
        onChange={handleFileChange}
      />

      <div className={styles.uploadRow}>
        <label
          htmlFor={id}
          className={`${styles.uploadArea} ${
            dragActive ? styles.uploadAreaActive : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className={styles.uploadIcon}>
            <Upload />
          </div>
          <p className={styles.uploadText}>
            <strong>Click to upload</strong> or drag & drop
          </p>
          <p className={styles.uploadSubtext}>.json files only</p>
        </label>
      </div>
    </div>
  );
};
