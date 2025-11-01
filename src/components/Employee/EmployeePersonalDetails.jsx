import React, { useEffect, useState, useRef } from "react";
import "../../Style/css/Offcanvas.css";
import PersonalDetailsStyle from "../../Style/People/AddPeopleDetails.Module.css";
import * as peopleAction from "../../actions/Employee/addEmployeeAction";
import { FaSpinner } from "react-icons/fa";
// CSS Import here
import styles from "../../../src/assets/css/modal.module.css";
import { images } from "../../assets/css/imagePath";
import "../../assets/css/datePicker.css";
import DatePicker from "react-datepicker";

const EmployeePersonalDetails = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState(
    props.selectedPeopledata?.dob ? new Date(props.selectedPeopledata?.dob) : null
  );
  const [gender, setGender] = useState("Male");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");

  const [fatherNameError, setFatherNameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);


  let companyName = localStorage.getItem("company");
  let owner = localStorage.getItem("isOwner");
  let empCode = localStorage.getItem("empCode");
  const savePeopleDataRef = useRef(null);

  useEffect(() => {
    if (owner === "Yes") {
      setLoggedInUserId("Owner");
    } else {
      setLoggedInUserId(empCode || null);
    }
  }, [owner, empCode]);

  useEffect(() => {
    if (props.isEdit) {
      setName(props.selectedPeopledata.name);
      setEmail(props.selectedPeopledata.email);
      setEmployeeId(props.selectedPeopledata.employeeCode);
      setFatherName(props.selectedPeopledata.fatherName || "");
      setGender(props.selectedPeopledata.gender || "Male");
      setMobileNumber(props.selectedPeopledata.mobile || "");
    }
  }, [props.isEdit, props.selectedPeopledata]);

  const handleInputChange = (type, value) => {
    peopleAction.validateDetailsFilleds(
      type,
      value,
      setName,
      setNameError,
      setEmail,
      setEmailError,
      setEmployeeId,
      setEmployeeIdError,
      setMobileNumber,
      setMobileNumberError,
      setFatherName,
      setFatherNameError,
      setDob,
      setDobError,
      setGender,
      setGenderError
    );
  };

  const savePeopleData = () => {
    peopleAction.handleSaveEmployeeDetails(
      companyName,
      loggedInUserId,
      props.selectedPeopledata.employeeCode,
      name,
      email,
      mobileNumber,
      fatherName,
      dob,
      gender,
      setDobError,
      setNameError,
      setMobileNumberError,
      setFatherNameError,
      clearFormData,
      props.setTriggerList,
      setIsLoading,
      props.setIsEdit,
      props.isEdit
    );
  };

  const clearFormData = () => {
    peopleAction.handleClearPersonalDetails(
      setNameError,
      setEmailError,
      setEmployeeIdError,
      setMobileNumberError,
      setFatherNameError,
      setDobError,
      setGenderError
    );
  };

  const handleCloseForm = () => {
    clearFormData();
    props.setIsEdit(false);
    props.setTriggerList(false);
    props.setShow(false);
  };

  savePeopleDataRef.current = savePeopleData;

  useEffect(() => {
    if (props.show) {
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (savePeopleDataRef.current) {
            savePeopleDataRef.current();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [props.show]);

  if (!props.show) {
    return null;
  }

  return (
    <>
      <div className={`${styles.overlay}`}>
        <div className={`${styles.modal} `}>
          <div className={`${styles.actionBtn}`}>
            <p className={styles.headerText}>Edit Personal Details</p>
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
              <div className="col-md-12">
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
                        value={name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {nameError && (
                    <div className={`${styles.errorMessage}`}>{nameError}</div>
                  )}
                </div>
              </div>

              {/* <div className="col-md-12">
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
                        value={email}
                        disabled={props.isEdit}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {emailError && (
                    <div className={`${styles.errorMessage}`}>{emailError}</div>
                  )}
                </div>
              </div> */}
              {/* 
              <div className="col-md-12">
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Employee ID</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        id="employeeId"
                        type="text"
                        className={`form-control ${styles.formTextbox} ${employeeIdError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        value={employeeId}
                        disabled={props.isEdit}
                        onChange={(e) =>
                          handleInputChange(
                            "employeeId",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </div>
                  </div>
                  {employeeIdError && (
                    <div className={`${styles.errorMessage}`}>
                      {employeeIdError}
                    </div>
                  )}
                </div>
              </div> */}

              <div className="col-md-12">
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Mobile</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        type="text"
                        id="mobileNumber"
                        className={`form-control ${styles.formTextbox} ${mobileNumberError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) =>
                          handleInputChange("mobileNumber", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {mobileNumberError && (
                    <div className={`${styles.errorMessage}`}>
                      {mobileNumberError}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-12">
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Father Name</div>
                    <div className={`${styles.textboxRight}`}>
                      <input
                        type="text"
                        id="fatherName"
                        className={`form-control ${styles.formTextbox} ${fatherNameError ? "is-invalid" : ""
                          }`}
                        placeholder=" "
                        value={fatherName}
                        onChange={(e) =>
                          handleInputChange("fatherName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {fatherNameError && (
                    <div className={`${styles.errorMessage}`}>
                      {fatherNameError}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-12">
                <div className={`input-password ${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Date of Birth</div>
                    <div className={`${styles.textboxRight} ${styles.formCalendarBox}`}>
                      <DatePicker
                        selected={dob}
                        onChange={(date) => {
                          const validDate = date instanceof Date ? date : new Date(date);
                          setDob(validDate);
                          if (dobError) setDobError("");
                        }}
                        dateFormat="dd-MM-yyyy"
                        className={`form-control ${styles.formTextbox} ${dobError ? "is-invalid" : ""
                          }`}
                        placeholderText=""
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        popperPlacement="auto"
                        maxDate={new Date()}
                        renderCustomHeader={({
                          date,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                          changeYear,
                          changeMonth,
                        }) => (
                          <div className="custom-datepicker-header d-flex align-items-center justify-content-between">
                            {/* Previous Button */}
                            <button
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              className="custom-nav-button"
                            >
                              <img
                                src={images.iconLeft}
                                className={`iconPreNext ${styles.iconPreNext}`}
                                title="Previous"
                                alt="icon"
                              />
                            </button>

                            {/* Month and Year Dropdowns */}
                            <div className="d-flex align-items-center">
                              {/* Month Dropdown */}
                              <div className="dropdown me-2">
                                <button
                                  className="btn btn-light dropdown-toggle btnMonthYear"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {new Date(0, date.getMonth()).toLocaleString(
                                    "default",
                                    {
                                      month: "long",
                                    }
                                  )}
                                </button>
                                <ul className="dropdown-menu DropdownMonthYear">
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <li key={i}>
                                      <a
                                        className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i ? "active" : ""
                                          }`}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          changeMonth(i);
                                        }}
                                      >
                                        {new Date(0, i).toLocaleString(
                                          "default",
                                          { month: "long" }
                                        )}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Year Dropdown */}
                              <div className="dropdown">
                                <button
                                  className="btn btn-light dropdown-toggle btnMonthYear"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  {date.getFullYear()}
                                </button>
                                <ul className="dropdown-menu DropdownMonthYear">
                                  {Array.from({ length: 100 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return (
                                      <li key={year}>
                                        <a
                                          className={`dropdown-item dropdownItemMonthYear ${date.getFullYear() === year
                                            ? "active"
                                            : ""
                                            }`}
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            changeYear(year);
                                          }}
                                        >
                                          {year}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>

                            {/* Next Button */}
                            <button
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              className="custom-nav-button"
                            >
                              <img
                                src={images.iconRight}
                                className={`iconPreNext ${styles.iconPreNext}`}
                                title="Next"
                                alt="icon"
                              />
                            </button>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  {dobError && (
                    <div className={`${styles.errorMessage}`}>{dobError}</div>
                  )}
                </div>

                {/* <div className={`form-floating mb-3`}>
                  <input
                    type="date"
                    id="dob"
                    className={`form-control ${dobError ? "is-invalid" : ""}`}
                    placeholder=" "
                    value={dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                  />
                  <label htmlFor="dob">DOB</label>
                </div> */}
              </div>
              <div className="col-md-12">
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Gender</div>
                    <div className={`${styles.textboxRight}`}>
                      <div
                        className={`${styles.radioBtnGroup} ${styles.radioBtnGroupNew}`}
                      >
                        <div
                          className={`${styles.radioGroup} ${styles.radioGroupNew}`}
                        >
                          <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="Male"
                            checked={gender === "Male"}
                            onChange={(e) => setGender(e.target.value)}
                            className={`${styles.radioBtn} ${styles.radioBtnNew}`}
                          />
                          <label
                            htmlFor="male"
                            className={`${styles.radioLabel}`}
                          >
                            Male
                          </label>
                        </div>

                        <div
                          className={`${styles.radioGroup} ${styles.radioGroupNew}`}
                        >
                          <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="Female"
                            checked={gender === "Female"}
                            onChange={(e) => setGender(e.target.value)}
                            className={`${styles.radioBtn} ${styles.radioBtnNew}`}
                          />

                          <label
                            htmlFor="female"
                            className={`${styles.radioLabel}`}
                          >
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <button
                  type="submit"
                  className={`btnSave mt-4`}
                  onClick={() => savePeopleData()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={PersonalDetailsStyle.Loginloadercontainer}>
                      <FaSpinner
                        className={PersonalDetailsStyle.spinnerLogin}
                      />
                      <span className={PersonalDetailsStyle.loaderText}>
                        Please wait...
                      </span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeePersonalDetails;
