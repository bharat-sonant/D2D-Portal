import { useEffect, useState } from "react";

import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import { saveWardAction } from "../../Actions/City/cityAction";

const AddWard = (props) => {
  const initialForm = {
    CityId: 0,
    Ward: "",
    display_name: "",

  };

  const [loading, setLoading] = useState(false);
  const [wardNumberError, setWardNumberError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
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

  }, [form, loading]);

  useEffect(() => {
    if (props.editWard?.ward) {
      setForm((pre) => ({
        Ward: props.editWard?.ward || "",
        display_name: props.editWard?.display_name || "",
      }));
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    saveWardAction(form, props.selectedCity?.city_id, props.editWard?.wardId, setLoading, setWardNumberError, resetStateValues, props.setWardList, setDisplayNameError, props.wardList,props.setSelectedWard);
  };



  const resetStateValues = () => {
    setForm(initialForm);
    setWardNumberError("")
    setDisplayNameError("")
    props.setOpenAddWardPopUp(false);
    setLoading(false);
    props.setEditWard({ ward: '', wardId: "", display_name: "" })
  }


  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>
            {props?.onEdit ? "Update" : "Add"} Ward
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
              <div className={styles.textboxLeft}>Display Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter display name"
                  name="display_name"
                  value={form.display_name}
                  onChange={handleChange}
                // disabled={Boolean(props?.onEdit && Object.keys(props?.onEdit).length)} // Assuming display_name is editable
                />
              </div>
            </div>
            {displayNameError && (
              <div className={`${styles.invalidfeedback}`}>{displayNameError}</div>
            )}
          </div>

          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Ward</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter ward name"
                  name="Ward"
                  value={form.Ward}
                  onChange={handleChange}
                  disabled={Boolean(props?.onEdit && Object.keys(props?.onEdit).length)}
                />
              </div>
            </div>
            {wardNumberError && (
              <div className={`${styles.invalidfeedback}`}>{wardNumberError}</div>
            )}
          </div>

          <button
            type="button"
            className={`mt-3 ${styles.btnSave}`}
            onClick={handleSave}
            disabled={loading} // Disable button while loading
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

export default AddWard;
