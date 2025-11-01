import { useState, useRef } from "react";
import "../../Style/css/Offcanvas.css";
// Modal CSS Import here
import styles from "../../../src/assets/css/modal.module.css";
import * as addEmployeeAction from '../../actions/Employee/AddEmployeeAction';
// import * as peopleAction from "../../actions/Employee/addEmployeeAction";
import { FaSpinner } from "react-icons/fa";
import { images } from "../../assets/css/imagePath";
import AddConfirmationModel from "./AddConfirmationModel";

const AddEmployee = (props) => {
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState('admin');
  const savePeopleDataRef = useRef(null);

  if (!props.showCanvas) {
    return null;
  }

  const handleInputChange = (type, value) => {
    addEmployeeAction.validateFilleds(
      type,
      value,
      props.setName,
      setNameError,
      props.setEmail,
      setEmailError,
      props.setEmployeeId,
      setEmployeeIdError
    );
  };

  const savePeopleData = () => {
    addEmployeeAction.handleSaveEmployeeData(
      loggedInUserId,
      props.name,
      props.email,
      props.employeeId,
      setNameError,
      setEmailError,
      setEmployeeIdError,
      props.hasLoginAccess,
      props.setShowCanvas,
      setIsLoading,
      clearFormData,
      props.setTriggerList,
      props.isEdit
    );
  };

  const clearFormData = () => {
    addEmployeeAction.handleClearFormData(
      props.setName,
      setNameError,
      props.setEmail,
      setEmailError,
      props.setEmployeeId,
      setEmployeeIdError,
      props.setHasLoginAccess,
      props.setIsEdit
    );
  };

  const handleCloseForm = () => {
    props.handleCloseCanvas();
    clearFormData();
    props.setTriggerList(false);
    props.setIsEdit(false);
  };

  return (
    <>
      <div className={`${styles.overlay}`}>
        <div className={`${styles.modal}`}>
          <div className={`${styles.actionBtn}`}>
            <p className={styles.headerText}>{props.isEdit ? "Edit Employee" : "Add Employee"}</p>
            <button className={`${styles.closeBtn}`} onClick={handleCloseForm}>
              <img
                src={images.iconClose}
                className={`${styles.iconClose}`}
                title="Close"
                alt="icon"
              />
            </button>
          </div>

          <div className={`${styles.modalBody}`}>
            <div className={`row`}>
              <div className={`col-md-12`}>
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Name</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        type="text"
                        id="Name"
                        className={`form-control ${styles.formTextbox} ${nameError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        value={props.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {nameError && (
                    <div className={`${styles.invalidfeedback}`}>
                      {nameError}
                    </div>
                  )}
                </div>
              </div>
              <div className={`col-md-12`}>
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Email</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        id="email"
                        type="text"
                        className={`form-control ${styles.formTextbox} ${emailError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        value={props.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {emailError && (
                    <div className={`${styles.invalidfeedback}`}>
                      {emailError}
                    </div>
                  )}
                </div>
              </div>

              <div className={`col-md-12`}>
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Employee Id</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        id="employeeId"
                        type="text"
                        className={`form-control ${styles.formTextbox} ${employeeIdError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        value={props.employeeId}
                        onChange={(e) =>
                          handleInputChange(
                            "employeeId",
                            e.target.value.toUpperCase()
                          )
                        }
                        disabled={props.isEdit}
                      />
                    </div>
                  </div>
                  {employeeIdError && (
                    <div className={`${styles.invalidfeedback}`}>
                      {employeeIdError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12 mt-2">
                <div className={`${styles.checkboxGroup}`}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={props.hasLoginAccess}
                      onChange={(e) => props.setHasLoginAccess(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />{" "}
                    Provide login access for IEC App
                  </label>
                </div>
              </div>
            </div>
            <div className={`col-md-12 p-0`}>
              <button
                type="submit"
                className={`mt-3 ${styles.btnSave}`}
                onClick={() => savePeopleData()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.Loginloadercontainer}>
                    <FaSpinner className={styles.spinnerLogin} />
                    <span className={styles.loaderText}>Please wait...</span>
                  </div>
                ) : (
                  props.isEdit ? "Update" : "Save"
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

    </>

  );
};

export default AddEmployee;
