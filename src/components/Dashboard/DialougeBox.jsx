import React, { useEffect, useState } from "react";
import styles from "../../../src/assets/css/modal.module.css";
import leaveStyle from "../../../src/assets/css/Dashboard/LeaveModal.module.css";
import { images } from "../../assets/css/imagePath";
import { saveLeave } from "../../actions/Attendance/AttendanceDetailsAction";
import { FaSpinner } from "react-icons/fa";
import "../../assets/css/datePicker.css";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns"; // ✅ Add this line

const DialougeBox = (props) => {
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [DateLable, setDateLable] = useState('Date')
  let company = localStorage.getItem("company");
  let companyName = localStorage.getItem("companyName");
  let empName = localStorage.getItem("name");
  let empCode = localStorage.getItem("empCode");

  const validateForm = () => {
    let newErrors = {};
    if (!props.singleDay && !props.multipleDay) {
      newErrors.selection = "Select Single Day or Multiple Day";
    }
    if (props.singleDay && !props.fromDate) {
      newErrors.fromDate = "Date is required";
    }
    if (props.multipleDay) {
      if (!props.fromDate) {
        newErrors.fromDate = "From Date is required";
      }

      if (!props.toDate) {
        newErrors.toDate = "To Date is required";
      }
    }
    if (!props.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    if (props.singleDay && props.leaveType === "") {
      newErrors.timeSelection = "Select Full Day, Pre Lunch, or Post Lunch";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
    switch (field) {
      case "fromDate":
        props.setFromDate(value);
        break;
      case "toDate":
        props.setToDate(value);
        break;
      case "reason":
        props.setReason(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!props.leaveType) {
      props.setLeaveType("Full Day");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoader(true);
      const finalToDate = props.singleDay ? props.fromDate : props.toDate;
      saveLeave(
        company,
        companyName,
        "adarsh.wevois@gmail.com",
        empCode,
        empName,
        props.reason,
        props.fromDate,
        finalToDate,
        props.leaveType,
        props.leaveId,
        handleclose,
        setLoader,
        props.setTrigger
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleclose = () => {
    props.onClose();
    props.setLeaveType("");
    props.setFromDate("");
    props.setToDate("");
    props.setReason("");
    props.setLeaveId("");
    props.setMultipleDay(false);
  };

  return (
    <div className={`${styles.overlay}`}>
      <div className={`${styles.modal}`}>
        <div className={`${styles.actionBtn}`}>
          <p className={styles.headerText}>Apply Leave</p>
          <button className={`${styles.closeBtn}`} onClick={handleclose}>
            <img
              src={images.iconClose}
              className={`${styles.iconClose}`}
              title="Close"
              alt="icon"
            />
          </button>
        </div>
        <div className={`${styles.modalBody}`}>
          <form>
            <div className="row">
              <div className="col-md-12">
                <span className={`${leaveStyle.labelLeave}`}>Leave</span>
                <div className={leaveStyle.leaveRow}>
                  {/* Single Day */}
                  <div className={leaveStyle.leave50}>
                    <label className={leaveStyle.radioWrapper}>
                      <input
                        type="radio"
                        // name="leaveType"
                        checked={props.singleDay}
                        onChange={() => {
                          props.setSingleDay(true);
                          props.setMultipleDay(false);
                          setDateLable('Date')
                          setErrors({});
                        }}
                        className={leaveStyle.radioInput}
                      />
                      <span className={leaveStyle.customRadio}></span>
                      <span className={leaveStyle.radioLabel}>Single Day</span>
                    </label>
                  </div>

                  {/* Multiple Day */}
                  <div className={leaveStyle.leave50}>
                    <label className={leaveStyle.radioWrapper}>
                      <input
                        type="radio"
                        // name="leaveType"
                        checked={props.multipleDay}
                        onChange={() => {
                          props.setMultipleDay(true);
                          props.setSingleDay(false);
                          setErrors({});
                          setDateLable('From Date')
                        }}
                        className={leaveStyle.radioInput}
                      />
                      <span className={leaveStyle.customRadio}></span>
                      <span className={leaveStyle.radioLabel}>
                        Multiple Day
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {errors.selection && (
                <p className={`${styles.invalidfeedback}`}>
                  {errors.selection}
                </p>
              )}

              <div className="col-md-12">
                {/* <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    value={props.fromDate || ""}
                    max={
                      props.toDate
                        ? formatDate(
                            new Date(props.toDate).setDate(
                              new Date(props.toDate).getDate() - 1
                            )
                          )
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("fromDate", e.target.value)
                    }
                  />
                  <label>
                    {props.multipleDay ? "From Date" : "Select Date"}
                  </label>
                  {errors.fromDate && (
                    <p className="text-danger text-start">{errors.fromDate}</p>
                  )}
                </div> */}

                <span className={`${leaveStyle.labelLeave}`}>{DateLable}</span>
                <div
                  className={`form-floating input-password mb-3 ${styles.formCalendarBox}`}
                >
                  <DatePicker
                    selected={props.fromDate ? new Date(props.fromDate) : null}
                    onChange={(date) => handleInputChange("fromDate", date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText={
                      props.multipleDay ? "From Date" : "Select Date"
                    }
                    className={`form-control ${errors.fromDate ? "is-invalid" : ""
                      }`}
                    // minDate={new Date()}
                    maxDate={
                      props.toDate
                        ? new Date(
                          new Date(props.toDate).setDate(
                            new Date(props.toDate).getDate() - 1
                          )
                        )
                        : "" // fallback to today if fromDate not set
                    }
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    popperPlacement="auto"
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
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            decreaseMonth();
                          }}
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
                                  <button
                                    className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i ? "active" : ""
                                      }`}

                                    onClick={(e) => {
                                      e.preventDefault();
                                      changeMonth(i);
                                    }}
                                  >
                                    {new Date(0, i).toLocaleString("default", {
                                      month: "long",
                                    })}
                                  </button>
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
                                const year = new Date().getFullYear() + i; // 👈 Future years only
                                return (
                                  <li key={year}>
                                    <button
                                      className={`dropdown-item dropdownItemMonthYear ${date.getFullYear() === year
                                        ? "active"
                                        : ""
                                        }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        changeYear(year);
                                      }}
                                    >
                                      {year}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            increaseMonth();
                          }}
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

                  {errors.fromDate && (
                    <p className={`${styles.invalidfeedback}`}>
                      {errors.fromDate}
                    </p>
                  )}
                </div>
              </div>

              {props.multipleDay && (
                <div className="col-md-12">
                  {/* <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      value={props.toDate || ""}
                      min={
                        props.fromDate
                          ? formatDate(
                              new Date(props.fromDate).setDate(
                                new Date(props.fromDate).getDate() + 1
                              )
                            )
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("toDate", e.target.value)
                      }
                    />
                    <label>To Date</label>
                    {errors.toDate && (
                      <p className="text-danger text-start">{errors.toDate}</p>
                    )}
                  </div> */}
                  <span className={`${leaveStyle.labelLeave}`}>To Date</span>
                  <div
                    className={`form-floating input-password mb-3 ${styles.formCalendarBox}`}
                  >

                    <DatePicker
                      selected={
                        props.toDate && !isNaN(new Date(props.toDate))
                          ? new Date(props.toDate)
                          : null
                      }
                      onChange={(date) => handleInputChange("toDate", date)}
                      selectsEnd
                      startDate={
                        props.fromDate ? new Date(props.fromDate) : null
                      }
                      endDate={props.toDate ? new Date(props.toDate) : null}
                      minDate={
                        props.fromDate
                          ? new Date(
                            new Date(props.fromDate).setDate(
                              new Date(props.fromDate).getDate() + 1
                            )
                          )
                          : "" // fallback to today if fromDate not set
                      }
                      dateFormat="dd-MM-yyyy"
                      placeholderText="To Date"
                      className={`form-control ${errors.toDate ? "is-invalid" : ""
                        }`}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      popperPlacement="auto"
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
                            type="button"
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
                                    <button
                                      className={`dropdown-item dropdownItemMonthYear ${date.getMonth() === i ? "active" : ""}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        changeMonth(i);
                                      }}
                                    >
                                      {new Date(0, i).toLocaleString(
                                        "default",
                                        {
                                          month: "long",
                                        }
                                      )}
                                    </button>
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
                                  const year = new Date().getFullYear() + i;
                                  return (
                                    <li key={year}>
                                      <button
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
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>

                          {/* Next Button */}
                          <button
                            type="button"
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

                    {errors.toDate && (
                      <p className={`${styles.invalidfeedback}`}>
                        {errors.toDate}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!props.multipleDay && (
                <>
                  <div className="col-md-12">
                    <span className={`${leaveStyle.labelLeave}`}>Leave Type</span>
                    <div className={`${leaveStyle.leaveTypeRow}`}>
                      <label className={leaveStyle.customCheckboxWrapper}>
                        <input
                          type="checkbox"
                          checked={props.leaveType === "Full Day"}
                          onChange={() => {
                            props.setLeaveType("Full Day");
                          }}
                          className={leaveStyle.customCheckboxInput}
                        />
                        <span className={leaveStyle.customCheckbox}></span>
                        <span className={leaveStyle.customCheckboxLabel}>
                          Full Day
                        </span>
                      </label>

                      <label className={leaveStyle.customCheckboxWrapper}>
                        <input
                          type="checkbox"
                          checked={props.leaveType === "Pre Lunch"}
                          onChange={() => {
                            props.setLeaveType("Pre Lunch");
                          }}
                          className={leaveStyle.customCheckboxInput}
                        />
                        <span className={leaveStyle.customCheckbox}></span>
                        <span className={leaveStyle.customCheckboxLabel}>
                          Pre Lunch
                        </span>
                      </label>

                      <label className={leaveStyle.customCheckboxWrapper}>
                        <input
                          type="checkbox"
                          checked={props.leaveType === "Post Lunch"}
                          onChange={() => {
                            props.setLeaveType("Post Lunch");
                          }}
                          className={leaveStyle.customCheckboxInput}
                        />
                        <span className={leaveStyle.customCheckbox}></span>
                        <span className={leaveStyle.customCheckboxLabel}>
                          Post Lunch
                        </span>
                      </label>
                    </div>
                  </div>

                  {errors.timeSelection && (
                    <p className={`${styles.invalidfeedback}`}>
                      {errors.timeSelection}
                    </p>
                  )}
                </>
              )}
              <div className="col-md-12">
                <span className={`${leaveStyle.labelLeave}`}>Leave Reason</span>
                <div className="form-floating textbox-reason mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={props.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
                  />
                  {errors.reason && (
                    <p className={`${styles.invalidfeedback}`}>
                      {errors.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12 p-0">
              <button
                type="submit"
                onClick={handleSubmit}
                className={`${styles.btnSave}`}
                disabled={loader === true}
                style={loader ? { width: "100%" } : {}}
              >
                {loader ? (
                  <div className={styles.Loginloadercontainer}>
                    <FaSpinner className={styles.spinnerLogin} />
                    <span className={styles.loaderText}>Please wait...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DialougeBox;
