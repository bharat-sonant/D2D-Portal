import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import { saveCityAction } from "../../Actions/City/cityAction";

const AddCity = (props) => {
  const initialForm = {
    city_code: "",
    city_name: "",
    status: "active",
    created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };

  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoError, setLogoError] = useState("");
  const [cityError, setCityError] = useState("");
  const [cityCodeError, setCityCodeError] = useState("");
  const [form, setForm] = useState(initialForm);

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
    if (e.target.name === 'city_code') {
      setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }

  };
  const handleSave = async () => {
    saveCityAction(form, logo, props, setLoading, setCityError, setCityCodeError, resetStateValues, setLogoError);
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
      setLogoError(`The image is too large. Please choose a smaller image. ${file.type === "image/svg+xml" ? "50KB" : "500KB"}.`);
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
    setCityCodeError("")
    setCityError("");
    setLogoError("");
    props.setShowCanvas(false);
    setLoading(false);
    setLogo(null);
    setLogoPreview("");
    props?.setOnEdit(false);
  }
  useMemo(() => {
    setForm((pre) => ({
      city_code: props?.onEdit?.city_code || "",
      city_name: props?.onEdit?.city_name || "",
      status: props?.onEdit?.status || "active",
      created_at: dayjs(props?.onEdit?.created_at).isValid()
        ? dayjs(props?.onEdit?.created_at).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss"),
    }));
    setLogoPreview(props?.onEdit?.logoUrl || '');
  }, [props?.onEdit]);

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>
            {props?.onEdit ? "Update" : "Add"} City
          </p>
          <button
            className={styles.closeBtn}
            onClick={() => {
              resetStateValues();
            }}
            aria-label="Close"
          >
            <img
              src={images.iconClose}
              className={styles.iconClose}
              title="Close"
              alt="close"
            />
          </button>
        </div>

        <div className={styles.modalBody}>

          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>City Code</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter city code"
                  name="city_code"
                  value={form.city_code}
                  onChange={handleChange}
                  disabled={Boolean(props?.onEdit && Object.keys(props?.onEdit).length)}
                />
              </div>
            </div>
            {cityCodeError && (
              <div className={`${styles.invalidfeedback}`}>{cityCodeError}</div>
            )}
          </div>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>City Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter city name"
                  name="city_name"
                  value={form.city_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            {cityError && (
              <div className={`${styles.invalidfeedback}`}>{cityError}</div>
            )}
          </div>

          {/* City Logo */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {/* Upload + Preview Row */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {/* hidden input */}
              <input
                type="file"
                accept="image/*"
                id="cityLogoInput"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />

              {/* upload box */}
              <label
                htmlFor="cityLogoInput"
                style={{
                  flex: 1,
                  height: "90px", // 👈 reduced height
                  border: "2px dashed #cbd5e1",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  backgroundColor: "#f8fafc",
                }}
              >
                <div style={{ fontSize: "18px" }}>📎</div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  Upload City Logo
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  PNG / SVG • Min 5KB, Max 500KB
                </div>
              </label>

              {/* preview left aligned */}
              {logoPreview && (
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="City Logo"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </div>

            {/* error */}
            {logoError && (
              <div style={{ color: "red", fontSize: "13px" }}>{logoError}</div>
            )}
          </div>

          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleSave}
          >
            {loading ? (
              <div className={styles.Loginloadercontainer}>
                <FaSpinner className={styles.spinnerLogin} />
                <span className={styles.loaderText}>Please wait...</span>
              </div>
            ) : props.onEdit ? (
              "Update"
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCity;
