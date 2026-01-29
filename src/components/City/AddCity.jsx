import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { Building2, X, Code, Upload, Plus, Check } from "lucide-react";
import styles from "./AddCity.module.css";
import modalStyles from "../../assets/css/popup.module.css";

import { saveCityAction } from "../../Actions/City/cityAction";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GlobalSpinnerLoader from "../Common/Loader/GlobalSpinnerLoader";

const AddCity = (props) => {
  const initialForm = {
    siteCode: "",
    siteName: "",
    status: "active",
  };

  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoError, setLogoError] = useState("");
  const [cityError, setCityError] = useState("");
  const [cityCodeError, setCityCodeError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !loading) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form, logo, loading]);

  const handleChange = (e) => {
    if (e.target.name === "siteCode") {
      setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
      console.log('citycodeerror',cityCodeError)
      if (cityCodeError) setCityCodeError("");
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
      if (e.target.name === "siteName" && cityError) setCityError("");
    }
  };
  const handleSave = async () => {
    if (logoError) return;
    const hasLogo = logo || (props.onEdit && props.onEdit.logoUrl);
    if (!hasLogo) {
      setLogoError("Site Logo is required.");
      return;
    }
    saveCityAction(
      form,
      logo,
      props,
      setLoading,
      setCityError,
      setCityCodeError,
      resetStateValues,
      setLogoError
    );
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/png", "image/svg+xml", "image/jpeg"]; // Allow JPG too based on tooltip, or strictly PNG/SVG? Request said PNG/SVG. Let's stick to common images but validate size.
    // Actually request said "Support only PNG or SVG formats". But existing tooltip says "PNG / JPG". I will respect the new strict requirement but maybe allow JPG if convenient, or strictly follow limit.
    // Request: "Support only PNG or SVG formats."
    if (!["image/png", "image/svg+xml"].includes(file.type)) {
      setLogoError("Only PNG and SVG formats are allowed.");
      return;
    }

    // Size Validation
    const minSize = 5 * 1024; // 5KB
    const maxSize = file.type === "image/svg+xml" ? 50 * 1024 : 500 * 1024; // 50KB for SVG, 500KB for PNG

    if (file.size < minSize) {
      setLogoError("Image is too small. Minimum size is 5KB.");
      return;
    }
    if (file.size > maxSize) {
      setLogoError(
        `The image is too large. Please choose a smaller image. ${
          file.type === "image/svg+xml" ? "50KB" : "500KB"
        }.`
      );
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Dimension Validation
      if (img.width < 100 || img.height < 100) {
        setLogoError("Image dimensions too small. Minimum 100x100 pixels.");
        return;
      }

      setLogoError(""); // Clear error if passed

      // Auto-scaling if > 500x500
      const maxDimension = 500;
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        const scale = Math.min(maxDimension / width, maxDimension / height);
        width = width * scale;
        height = height * scale;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const resized = new File([blob], file.name, { type: file.type });
          setLogo(resized);
          setLogoPreview(URL.createObjectURL(resized));
        }
      }, file.type);
    };
  };

  const resetStateValues = () => {
    setForm(initialForm);
    setCityCodeError("");
    setCityError("");
    setLogoError("");
    props.setShowCanvas(false);
    setLoading(false);
    setLogo(null);
    setLogoPreview("");
    props?.setOnEdit(false);
  };

  useEffect(() => {
    if (!props?.onEdit) return;
    setForm((pre) => ({
      siteCode: props?.onEdit?.site_code || "",
      siteName: props?.onEdit?.site_name || "",
      status: props?.onEdit?.status || "active",
      created_at: dayjs(props?.onEdit?.created_at).isValid()
        ? dayjs(props?.onEdit?.created_at).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss"),
    }));
    setLogoPreview(props?.onEdit?.logoUrl || "");
  }, [props?.onEdit]);

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
      const file = e.dataTransfer.files[0];

      // fake event bana ke same validation reuse
      handleLogoChange({ target: { files: [file] } });
    }
  };

  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={`${modalStyles.modal} ${styles.modal}`}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <Building2 className="map-icon" />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {props?.onEdit ? "Update" : "Add New"} Site
              </h2>
              <p className={modalStyles.modalSubtitle}>
                {props?.onEdit
                  ? "Modify your Site information"
                  : "Choose your preferred site location"}
              </p>
            </div>
          </div>
          <button
            className={modalStyles.closeBtn}
            onClick={() => {
              resetStateValues();
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={modalStyles.modalBody}>
          {/* Site Code */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Site Code</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Code size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter site code"
                name="siteCode"
                value={form.siteCode}
                onChange={handleChange}
                disabled={Boolean(
                  props?.onEdit && Object.keys(props?.onEdit).length
                )}
              />
            </div>
            {cityCodeError && <ErrorMessage message={cityCodeError} />}
          </div>

          {/* Site Name */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Site Name</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Building2 size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter site name"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
              />
            </div>
            {cityError && <ErrorMessage message={cityError} />}
          </div>

          {/* Site Logo */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Upload Site Logo</label>
            <div className={styles.uploadWrapper}>
              {/* hidden input */}
              <input
                type="file"
                accept="image/png, image/svg+xml"
                id="siteLogoInput"
                className={styles.fileInput}
                onChange={handleLogoChange}
              />

              <div className={styles.uploadRow}>
                {/* preview */}
                {logoPreview && (
                  <div className={styles.previewBox}>
                    <img
                      src={logoPreview}
                      alt="Site Logo"
                      className={styles.previewImg}
                    />
                  </div>
                )}
                {/* upload box */}
                <label
                  htmlFor="siteLogoInput"
                  className={`${styles.uploadArea} 
        ${dragActive ? styles.uploadAreaActive : ""} 
        ${logoPreview ? styles.uploadAreaSuccess : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {!logoPreview ? (
                    <>
                      <div className={styles.uploadIcon}>
                        <Upload />
                      </div>
                      <p className={styles.uploadText}>
                        <strong>Click to upload</strong> or drag & drop
                      </p>
                      <p className={styles.uploadSubtext}>
                        PNG / SVG • Min 5KB, Max 500KB
                      </p>
                    </>
                  ) : (
                    <div
                      className={styles.uploadSuccess}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("siteLogoInput").click();
                      }}
                      title="Change File"
                    >
                      <div className={styles.successIcon}>
                        <Plus />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* error */}
            {logoError && <ErrorMessage message={logoError} />}
          </div>
         
        </div>
        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button
            type="button"
            className={`${modalStyles.submitBtn}`}
            onClick={handleSave}
          >
            {loading ? (
              <GlobalSpinnerLoader />
            ) : props.onEdit ? (
              <div className={styles.btnContent}>
                <Check size={18} />
                <span>Update Site</span>
              </div>
            ) : (
              <div className={styles.btnContent}>
                <Plus size={18} />
                <span style={{ marginTop: "2px" }}>Add Site</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCity;
