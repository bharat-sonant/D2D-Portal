import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import {useState } from "react";
import {saveCityWithLogo} from "../../services/supabaseServices";
import dayjs from "dayjs";
import * as common from "../../common/common";
import { FaSpinner } from "react-icons/fa";

const AddCity = (props) => {
  const initialForm = {
    name: "",
    status: "active",
    created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  
const [loading, setLoading] = useState(false);
const [logo, setLogo] = useState(null);
const [logoPreview, setLogoPreview] = useState("");
const [logoError, setLogoError] = useState("");
const [cityError,setCityError]=useState("")
const [form,setForm]=useState(initialForm)


  if (!props.showCanvas) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    let loggedUserName = localStorage.getItem('userName')
    let isValid = true;
    setCityError("");
 
  
    if (!form.name) {
      setCityError("Name is required");
      isValid = false;
    }
    if(logo===null){
       setLogoError("Logo is required");
      isValid = false;
    }
  

    if (isValid) {
      setLoading(true);
      let cityDetail = {
        name: form.name,
        status:"active",
        created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        created_by:loggedUserName
      };

        try {
          await saveCityWithLogo(cityDetail,logo);
          resetStateValues();
           props.loadCities();
          common.setAlertMessage("success", "City added successfully");
        } catch (err) {
          console.log(err)
          setLoading(false);
          if (err.code === "23505") {
            if (err.details?.includes("name")) {
              setCityError("City name already exists!");
            } 
             else {
              common.setAlertMessage("error", "Duplicate value exists!");
            }
          } else {
            common.setAlertMessage("error", "Something went wrong!");
          }
        }
    }
  };

  

  const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setLogoError("Please upload a valid image file");
    return;
  }

  setLogoError("");
  setLogo(file);
  setLogoPreview(URL.createObjectURL(file));
};


  function resetStateValues() {
    setForm(initialForm);
    setCityError('')
    setLogoError('')
    props.setShowCanvas(false);
    setLoading(false);
    setLogo(null)
    setLogoPreview("")
  }

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Add City</p>
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
              <div className={styles.textboxLeft}>City Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter city name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            {cityError && (
              <div className={`${styles.invalidfeedback}`}>{cityError}</div>
            )}
          </div>
          {/* City Logo */}
<div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>


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
    <div style={{ color: "red", fontSize: "13px" }}>
      {logoError}
    </div>
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
