import { useEffect, useState } from "react";
import styles from "./AddWard.module.css";
import { MapPinned, X, Eclipse, Check, Plus } from "lucide-react";
import modalStyles from "../..//assets/css/popup.module.css";
import { saveWardAction } from "../../Actions/City/cityAction";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import GlobalSpinnerLoader from "../Common/Loader/GlobalSpinnerLoader";

const AddWard = (props) => {
  const initialForm = {
    CityId: 0,
    Ward: "",
    display_name: "",
  };

  console.log("props", props);

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
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setWardNumberError("");
    setDisplayNameError("");
  };
  const handleSave = async () => {
    saveWardAction(
      form,
      props.selectedCity?.city_id,
      props.editWard?.wardId,
      setLoading,
      setWardNumberError,
      resetStateValues,
      props.setWardList,
      setDisplayNameError,
      props.wardList,
      props.setSelectedWard,
      props.setOnEdit
    );
  };

  const resetStateValues = () => {
    setForm(initialForm);
    setWardNumberError("");
    setDisplayNameError("");
    props.setOpenAddWardPopUp(false);
    setLoading(false);
    props.setEditWard({ ward: "", wardId: "", display_name: "" });
    props.setOnEdit(false);
  };

  return (
    <div className={modalStyles.overlay} aria-modal="true" role="dialog">
      <div className={`${modalStyles.modal} ${styles.modal}`}>
        {/* Header */}
        <div className={modalStyles.modalHeader}>
          <div className={modalStyles.headerLeft}>
            <div className={modalStyles.iconWrapper}>
              <MapPinned className="map-icon" />
            </div>
            <div className={modalStyles.headerTextRight}>
              <h2 className={modalStyles.modalTitle}>
                {props?.onEdit ? "Update" : "Add New"} Ward
              </h2>
              <p className={modalStyles.modalSubtitle}>
                {props?.onEdit
                  ? "Modify your ward information"
                  : "Choose your preferred ward location"}
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
          {/* Dispaly Name */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Display Name</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <Eclipse size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter dispaly name"
                name="display_name"
                value={form.display_name}
                onChange={handleChange}
              />
            </div>
            {displayNameError && <ErrorMessage message={displayNameError} />}
          </div>
          {/* Ward */}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Ward Name</label>
            <div className={modalStyles.inputWrapper}>
              <div className={modalStyles.inputIcon}>
                <MapPinned size={18} />
              </div>
              <input
                className={modalStyles.input}
                type="text"
                placeholder="Enter ward name"
                name="Ward"
                value={form.Ward}
                onChange={handleChange}
                disabled={Boolean(
                  props?.onEdit && Object.keys(props?.onEdit).length
                )}
              />
            </div>
            {wardNumberError && <ErrorMessage message={wardNumberError} />}
          </div>
        </div>
        {/* Footer */}
        <div className={modalStyles.modalFooter}>
          <button
            type="button"
            className={`${modalStyles.submitBtn}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <GlobalSpinnerLoader />
            ) : props.onEdit ? (
              <div className={styles.btnContent}>
                <Check size={18} />
                <span>Update</span>
              </div>
            ) : (
              <div className={styles.btnContent}>
                <Plus size={18} />
                <span style={{ marginTop: "2px" }}>Add Ward</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWard;
