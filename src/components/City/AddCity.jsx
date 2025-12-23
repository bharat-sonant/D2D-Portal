import {useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import { saveCityAction } from "../../Actions/City/cityAction";

const AddCity = (props) => {
  const initialForm = {
    CityCode:"",
    CityName: "",
    Status: "active",
    Created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };

  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoError, setLogoError] = useState("");
  const [cityError, setCityError] = useState("");
  const [cityCodeError,setCityCodeError]=useState("");
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    if(e.target.name==='CityCode'){
       setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });
    }else{
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    
  };
  const handleSave = async () => {
   
    saveCityAction(form,logo,props,setLoading,setCityError,setCityCodeError,resetStateValues,setLogoError);
  };
 const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const max = 70;
    const scale = Math.min(max / img.width, max / img.height, 1);

    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const resized = new File([blob], file.name, { type: file.type });
      setLogo(resized);
      setLogoPreview(URL.createObjectURL(resized));
    }, file.type);
  };
};

  const resetStateValues=()=>{
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
        CityCode: props?.onEdit?.CityCode || "",
        CityName: props?.onEdit?.CityName || "",
        Status: props?.onEdit?.Status || "active",
        Created_at: dayjs(props?.onEdit?.CreatedAt).isValid()
        ? dayjs(props?.onEdit?.CreatedAt).format("YYYY-MM-DD HH:mm:ss")
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
                  name="CityCode"
                  value={form.CityCode}
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
                  name="CityName"
                  value={form.CityName}
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
                  PNG / JPG • Max 2MB
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
