import { images } from "../../assets/css/imagePath";
import styles from "../../assets/css/modal.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { createUser, updateUser } from "../../services/supabaseServices";
import dayjs from "dayjs";
import { sendEmployeeLoginCredentialsTemplate } from "../../common/emailHTMLTemplates/MailTemplates";
import * as common from "../../common/common";
import { FaSpinner } from "react-icons/fa";

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
    let isValid = true;
    setUserNameError("");
    setNameError("");
    setEmailError("");
    if (!form.username) {
      setUserNameError("User name is required");
      isValid = false;
    }

    if (!form.name) {
      setNameError("Name is required");
      isValid = false;
    }

    if (!form.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
      !form.email.endsWith(".com")
    ) {
      setEmailError("Please enter a valid email ending with .com");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (isValid) {
      setLoading(true);
      let loginURL = "https://d2d-portal-qa.web.app";
      let randomPasword = common.generateRandomCode();
      let encrptpassword = common.encryptValue(randomPasword);
      let encrptMail = common.encryptValue(form.email);
      let userDetail = {
        username: form.username,
        name: form.name,
        email: encrptMail,
        status:"active",
        created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        password: encrptpassword, 
      };

      if (props.onEdit) {
        let updatedDetail = {
          username: form.username,
          name: form.name,
          email: encrptMail,
          status: form.status,
          created_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          password: form.password,
        };
        await updateUser(props.editData.id, updatedDetail);
        resetStateValues();
        props.loadUsers();
        common.setAlertMessage("success", "Data updated successfully");
      } else {
        try {
          await createUser('users',userDetail);
          await sendLoginCredentialsToEmployee(
            form.email,
            form.username,
            randomPasword,
            loginURL
          );
          resetStateValues();
          props.loadUsers();
          common.setAlertMessage("success", "User created successfully");
        } catch (err) {
          setLoading(false);
          if (err.code === "23505") {
            if (err.details?.includes("username")) {
              setUserNameError("Username already exists!");
            } else if (err.details?.includes("email")) {
              setEmailError("Email already exists!");
            } else {
              common.setAlertMessage("error", "Duplicate value exists!");
            }
          } else {
            common.setAlertMessage("error", "Something went wrong!");
          }
        }
      }
    }
  };

  const sendLoginCredentialsToEmployee = async (
    email,
    username,
    password,
    loginURL
  ) => {
    try {
      const url = common.MAILAPI;
      const subject = "D2D Portal Login Credentials";
      const htmlBody = sendEmployeeLoginCredentialsTemplate(
        username,
        password,
        loginURL
      );

      const response = await axios.post(url, {
        to: email,
        subject,
        html: htmlBody,
      });
     
      return response.status === 200 ? "success" : "failure";
      
    } catch (error) {
      console.log(error);
      throw error;
    }
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
