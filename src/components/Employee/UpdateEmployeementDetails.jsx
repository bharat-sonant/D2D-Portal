import { useEffect, useState } from "react";
import styles from "../../../src/assets/css/modal.module.css";
import { images } from "../../assets/css/imagePath";
import "../../assets/css/datePicker.css";
import DatePicker from "react-datepicker";
import {
  getBranchesData,
  getDepartmentData,
  getDesignationData,
  SaveEmployeementPersonalDetails,
} from "../../actions/Employee/addEmployeeAction";
import { useRef } from "react";

const UpdateEmployeementDetails = (props) => {
  const [branchId, setBranchId] = useState(props.initialData?.branchId || "");
  const [departmentId, setDepartmentId] = useState(
    props.initialData?.departmentId || ""
  );
  const [designationId, setDesignationId] = useState(
    props.initialData?.designationId || ""
  );
  const [joiningDate, setJoiningDate] = useState(
    props.initialData?.dateOfJoining
      ? new Date(props.initialData.dateOfJoining)
      : null
  );

  const [branchNameError, setBranchNameError] = useState("");
  const [departmentNameError, setDepartmentNameError] = useState("");
  const [designationNameError, setDesignationNameError] = useState("");
  const [joiningDateError, setJoiningDateError] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const branchDropdownRef = useRef(null);
  const departmentDropdownRef = useRef(null);
  const designationDropdownRef = useRef(null);


  let owner = localStorage.getItem("isOwner");
  let empCode = localStorage.getItem("empCode");
  let previousDepartmentId = props.initialData?.departmentId || "";
  let previousDesignationId = props.initialData?.designationId || "";

  useEffect(() => {
    if (props.initialData.length !== 0) {
      getDesignationData(
        props.Company,
        props.initialData?.departmentId,
        props.setDesignationData
      );
    }
  }, []);
  useEffect(() => {
    if (owner === "Yes") {
      setLoggedInUserId("Owner");
    } else {
      setLoggedInUserId(empCode || null);
    }
  }, [owner, empCode]);

  useEffect(() => {
    if (props.show && props.Company) {
      getBranchesData(props.Company, props.setBranchData);
      getDepartmentData(props.Company, props.setDepartmentData);
    }
  }, [props.show, props.Company]);
  
  const handleSelectBranch = (e) => {
    const selectedBranch = e.target.value;
    if (selectedBranch === "") {
      setBranchNameError("Branch is required");
      setBranchId(null);
      return;
    }

    setBranchNameError("");
    setBranchId(selectedBranch);
    if (branchDropdownRef.current) {
      const dropdown = window.bootstrap.Dropdown.getInstance(branchDropdownRef.current) ||
        new window.bootstrap.Dropdown(branchDropdownRef.current);
      dropdown.hide();
    }
  };

const handleDesignationChange = (e) => {
  const selectedDesignation = e.target.value;
  if (!selectedDesignation) {
    setDesignationNameError("Designation is required");
    setDesignationId(null);
    return;
  }

  setDesignationNameError("");
  setDesignationId(selectedDesignation);

  // Close dropdown
  if (designationDropdownRef.current) {
    const dropdown = window.bootstrap.Dropdown.getInstance(designationDropdownRef.current) ||
      new window.bootstrap.Dropdown(designationDropdownRef.current);
    dropdown.hide();
  }
};


  const handleDepartmentChange = (e) => {
  const selectedDept = e.target.value;
  if (!selectedDept) {
    setDepartmentNameError("Department is required");
    setDepartmentId(null);
    return;
  }

  setDepartmentNameError("");
  setDepartmentId(selectedDept);

  // Close dropdown
  if (departmentDropdownRef.current) {
    const dropdown = window.bootstrap.Dropdown.getInstance(departmentDropdownRef.current) ||
      new window.bootstrap.Dropdown(departmentDropdownRef.current);
    dropdown.hide();
  }

  const foundDepartment = props.departmentData.find(
    (dept) => dept.departmentId === selectedDept
  );
  if (foundDepartment) {
    getDesignationData(
      props.Company,
      foundDepartment.departmentId,
      props.setDesignationData
    );
  }
};


  const clearFormData = () => {
    setBranchId("");
    setDepartmentId("");
    setDesignationId("");
    setJoiningDate(new Date().toISOString().split("T")[0]);
  };
  const handleCloseWindow = () => {
    props.setShow(false);
    clearFormData();
  };

  const saveEmployeementDetails = () => {
    SaveEmployeementPersonalDetails(
      props.Company,
      loggedInUserId,
      props.EmpCode,
      branchId,
      departmentId,
      designationId,
      joiningDate,
      props.setShow,
      setBranchNameError,
      setDepartmentNameError,
      setDesignationNameError,
      setJoiningDateError,
      props.setRenderList,
      handleCloseWindow,
      previousDepartmentId,
      previousDesignationId
    );
  };

  if (!props.show) {
    return null;
  }

  return (
    <>
      <div className={`${styles.overlay}`}>
        <div className={`${styles.modal}`}>
          <div className={`${styles.actionBtn}`}>
            <p className={styles.headerText}>Edit Employment Details</p>
            <button
              className={`${styles.closeBtn}`}
              onClick={handleCloseWindow}
            >
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
                    <div className={`${styles.textboxLeft}`}>Branch</div>
                    <div className={`${styles.textboxRight}`}>
                      {/* <select
                        value={branchId}
                        onChange={handleSelectBranch}
                        className={`${styles.formTextbox} ${
                          branchNameError ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Branch</option>
                        {props.branchData.map((brch, index) => (
                          <option key={index} value={brch.branchId}>
                            {brch.name}
                          </option>
                        ))}
                      </select> */}
                      <div className={`dropdown`}>
                        <button
                          ref={branchDropdownRef}
                          className={`btn customDropdownBtn ${branchNameError ? "is-invalid" : ""
                            }`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {branchId
                            ? props.branchData.find(
                              (brch) => brch.branchId === branchId
                            )?.name || "Select Branch"
                            : "Select Branch"}
                        </button>
                        <ul className={`dropdown-menu selectDropdown`}>
                          {props.branchData.map((brch, index) => (
                            <li key={index}>
                              <button
                                className={`customDropdownItem`}
                                onClick={() =>
                                  handleSelectBranch({
                                    target: { value: brch.branchId },
                                  })
                                }
                              >
                                {brch.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {branchNameError && (
                    <div className={`${styles.errorMessage}`}>
                      {branchNameError}
                    </div>
                  )}
                </div>
              </div>
              <div className={`col-md-12`}>
                <div className={`${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>Department</div>
                    <div className={`${styles.textboxRight}`}>
                      {/* <select
                        value={departmentId}
                        onChange={handleDepartmentChange}
                        className={`${styles.formTextbox} ${
                          departmentNameError ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Select Department</option>
                        {props.departmentData.map((dept, index) => (
                          <option key={index} value={dept.departmentId}>
                            {dept.name}
                          </option>
                        ))}
                      </select> */}
                      <div className={`dropdown`}>
                        <button
                         ref={departmentDropdownRef}
                          className={`btn customDropdownBtn ${departmentNameError ? "is-invalid" : ""
                            }`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {departmentId
                            ? props.departmentData.find(
                              (dept) => dept.departmentId === departmentId
                            )?.name || "Select Department"
                            : "Select Department"}
                        </button>
                        <ul className={`dropdown-menu selectDropdown`}>
                          {props.departmentData.map((dept, index) => (
                            <li key={index}>
                              <button
                                className={`customDropdownItem`}
                                onClick={() =>
                                  handleDepartmentChange({
                                    target: { value: dept.departmentId },
                                  })
                                }
                              >
                                {dept.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {departmentNameError && (
                    <div className={`${styles.errorMessage}`}>
                      {departmentNameError}
                    </div>
                  )}
                </div>
              </div>

              <div className={`col-md-12`}>
                {/* Designation Select (visible after department selection) */}
                {departmentId && (
                  <div className={`${styles.textboxGroup}`}>
                    <div className={`${styles.textboxMain}`}>
                      <div className={`${styles.textboxLeft}`}>Designation</div>
                      <div className={`${styles.textboxRight}`}>
                        {/* <select
                          value={designationId}
                          onChange={handleDesignationChange}
                          className={`${styles.formTextbox} ${
                            designationNameError ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Select Designation</option>
                          {props.designationData.map((designation, index) => (
                            <option key={index} value={designation.dsgId}>
                              {designation.name}
                            </option>
                          ))}
                        </select> */}
                        <div className={`dropdown`}>
                          <button
                          ref={designationDropdownRef}
                            className={`btn customDropdownBtn ${designationNameError ? "is-invalid" : ""
                              }`}
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {designationId
                              ? props.designationData.find(
                                (designation) =>
                                  designation.dsgId === designationId
                              )?.name || "Select Designation"
                              : "Select Designation"}
                          </button>
                          <ul className={`dropdown-menu selectDropdown`}>
                            {props.designationData.map((designation, index) => (
                              <li key={index}>
                                <button
                                  className={`customDropdownItem`}
                                  onClick={() =>
                                    handleDesignationChange({
                                      target: { value: designation.dsgId },
                                    })
                                  }
                                >
                                  {designation.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {designationNameError && (
                      <div className={`${styles.errorMessage}`}>
                        {designationNameError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={`col-md-12`}>
                <div className={`input-password ${styles.textboxGroup}`}>
                  <div className={`${styles.textboxMain}`}>
                    <div className={`${styles.textboxLeft}`}>
                      Date of Joining
                    </div>
                    <div
                      className={`${styles.textboxRight} ${styles.formCalendarBox}`}
                    >
                      <DatePicker
                        selected={joiningDate} // Ensure this is a Date object
                        // onChange={(date) =>
                        //   setJoiningDate(
                        //     date instanceof Date ? date : new Date(date)
                        //   )
                        // }
                        onChange={(date) => {
                          const validDate = date instanceof Date ? date : new Date(date);
                          setJoiningDate(validDate);
                          if (joiningDateError) setJoiningDateError("");
                        }}
                        dateFormat="dd-MM-yyyy"
                        className={`form-control ${styles.formTextbox} ${joiningDateError ? "is-invalid" : ""
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
                  {joiningDateError && (
                    <div className={`${styles.errorMessage}`}>
                      {joiningDateError}
                    </div>
                  )}
                </div>
              </div>
              <div className={`col-md-12`}>
                <button
                  type="submit"
                  className={`mt-3 ${styles.btnSave}`}
                  onClick={saveEmployeementDetails}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmployeementDetails;
