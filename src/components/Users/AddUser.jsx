import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import * as common from "../../common/common";
import { FaSpinner } from "react-icons/fa";
import * as userAction from '../../Actions/UserAction/UserAction'

const AddUser = (props) => {
  const initialForm = {
    username: "",
    name: "",
    email: "",
    status: "active",
    created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    password: "",
  };
  const [form, setForm] = useState(initialForm);
  const [userNameError, setUserNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.onEdit && props.editData) {
      const decryptedEmail = common.decryptValue(props.editData.email);
      setForm({
        ...props.editData,
        email: decryptedEmail,
      });
    }
  }, [props.onEdit, props.editData]);

  if (!props.showCanvas) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {  
         userAction.validateUserDetail(form,props.onEdit,props.editData,setUserNameError,setNameError,setEmailError,setLoading,props.loadUsers,resetStateValues)
  };


  function resetStateValues() {
    setForm(initialForm);
    setUserNameError("");
    setNameError("");
    setEmailError("");
    props.setShowCanvas(false);
    props.setOnEdit(false);
    setLoading(false);
  }

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal}>
        <div className={styles.actionBtn}>
          <p className={styles.headerText}>Add User</p>
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
              <div className={styles.textboxLeft}>User Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter user name"
                  value={form.username}
                  onChange={handleChange}
                  disabled={props.onEdit === true}
                />
              </div>
            </div>
            {userNameError && (
              <div className={`${styles.invalidfeedback}`}>{userNameError}</div>
            )}
          </div>

          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}> Name</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            {nameError && (
              <div className={`${styles.invalidfeedback}`}>{nameError}</div>
            )}
          </div>
          <div className={styles.textboxGroup}>
            <div className={styles.textboxMain}>
              <div className={styles.textboxLeft}>Email</div>
              <div className={styles.textboxRight}>
                <input
                  type="text"
                  className={`form-control ${styles.formTextbox}`}
                  placeholder="Enter email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            {emailError && (
              <div className={`${styles.invalidfeedback}`}>{emailError}</div>
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

export default AddUser;
