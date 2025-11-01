import React, { useEffect, useState } from "react";
import styles from "../../assets/css/Employee/EmployementDetails.module.css";

import DialogueBox from "../Attendance/DialogueBox.jsx";
import {
  checkAttendanceApproveOrNot,
  removeFromManager,
  setAsManager,
} from "../../services/Employee/AttendanceManagerService.js";
import EmployeePersonalDetails from "./EmployeePersonalDetails.jsx";

import dayjs from "dayjs";
import { images } from "../../assets/css/imagePath.js";

const PersonalDetails = (props) => {
  const companyName = localStorage.getItem("company");
  const [openPersonalDetailsWindow, setOpenPersonalDetailsWindow] =
    useState(false);
  const [isManager, setIsManager] = useState(false);
  const [setManager, setSetManager] = useState(false);
  const [removeManager, setRemoveManager] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  let owner = localStorage.getItem("isOwner");
  let empCode = localStorage.getItem("empCode");

  useEffect(() => {
    if (owner === "Yes") {
      setLoggedInUserId("Owner");
    } else {
      setLoggedInUserId(empCode || null);
    }
  }, [owner, empCode]);

  useEffect(() => {
    setSetManager(false);
    setRemoveManager(false);
  }, [props.peopleEmpCode]);

  useEffect(() => {
    if (props.peopleEmpCode) {
     
    } else {
      props.setName("");
      props.setEmpStatus("");
      setProfileImage("");
      props.setSelectedPeopleData([]);
    }
  }, [props.peopleEmpCode, props.triggerList]);

  const handleEditPeople = () => {
    if (Array.isArray(props.filteredUsers)) {
      if (props.filteredUsers.length !== 0) {
        props.setIsEdit(true);
        setOpenPersonalDetailsWindow(true);
      }
    }
  };

  const handleSetAsManager = () => {
    setAsManager(companyName, props.peopleEmpCode, props.name).then((resp) => {
      if (resp === "success") {
        setIsManager(true);
        setSetManager(false);
      }
    });
  };

  const handleRemoveAsManager = () => {
    removeFromManager(companyName, props.peopleEmpCode).then((response) => {
      if (response === "success") {
        setIsManager(false);
        setRemoveManager(false);
      }
    });
  };

  return (
    <>
      <div className={`${styles.defaultBG}`} >
        <div className={`${styles.defaultHeader}`} >
          <div className={`${styles.defaultHeaderLeft}`}>Personal Details</div>
          <div className={`${styles.defaultHeaderRight}`}>
            <img
              src={images.iconEdit}
              className={`img-fluid ${styles.iconEdit}`}
              title="Edit"
              alt="icon"
              onClick={handleEditPeople}
            />
          </div>
        </div>
        <div className={`${styles.commonBody}`}>
          <ul className={`${styles.commonBodyUL}`}>
            <li className={`${styles.commonBodyLi}`} title="Father Name">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconUser}`}
                  className={`${styles.iconDefault}`}
                  title="Father Name"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.selectedPeopledata.fatherName || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Email">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconEmail}`}
                  className={`${styles.iconDefault}`}
                  title="Email"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.selectedPeopledata.email || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Mobile">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconPhone}`}
                  className={`${styles.iconDefault}`}
                  title="Mobile"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.selectedPeopledata.mobile || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Gender">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconGender}`}
                  className={`${styles.iconDefault}`}
                  title="Gender"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.selectedPeopledata.gender || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Date of Birth">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconCalendar}`}
                  className={`${styles.iconDefault}`}
                  title="Date of Birth"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.selectedPeopledata.dob
                  ? dayjs(props.selectedPeopledata.dob).isValid()
                    ? dayjs(props.selectedPeopledata.dob).format("DD MMM YYYY")
                    : "N/A"
                  : "N/A"}
              </div>
            </li>
          </ul>
        </div>
        {/* <div className={`${styles.pageRow}`}>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconUser}
                className={`img-fluid ${styles.iconDefault}`}
                title="Branch"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Father Name</div>
              <div className={`${styles.userDesignation}`}>
                {props.selectedPeopledata.fatherName || "N/A"}
              </div>
            </div>
          </div>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconEmail}
                className={`img-fluid ${styles.iconDefault}`}
                title="Email"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Email</div>
              <div className={`${styles.userDesignation}`}>
                {props.selectedPeopledata.email || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.pageRow}`}>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconPhone}
                className={`img-fluid ${styles.iconDefault}`}
                title="Mobile"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Mobile</div>
              <div className={`${styles.userDesignation}`}>
                {props.selectedPeopledata.mobile || "N/A"}
              </div>
            </div>
          </div>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconGender}
                className={`img-fluid ${styles.iconDefault}`}
                title="Gender"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Gender</div>
              <div className={`${styles.userDesignation}`}>
                {props.selectedPeopledata.gender || "N/A"}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.pageRow}`}>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconCalendar}
                className={`img-fluid ${styles.iconDefault}`}
                title="Date of Birth"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Date of Birth</div>
              <div className={`${styles.userDesignation}`}>
                {props.selectedPeopledata.dob
                  ? dayjs(props.selectedPeopledata.dob).isValid()
                    ? dayjs(props.selectedPeopledata.dob).format("DD MMM YYYY")
                    : "N/A"
                  : "N/A"}
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div className={PeopleDetailsStyle.container}>
        <h5 className={PeopleDetailsStyle.header}>Person Details</h5>
        <div className={PeopleDetailsStyle.Input}>
          <img
            id="selectedAvatar"
            src={profileImage ? profileImage : images.userDeafultImg}
            alt="Selected Avatar"
            className={`rounded-circle border ${PeopleDetailsStyle.customAvatar}`}
          />
        </div>
        <div className={PeopleDetailsStyle.Details}>
          <p>
            <FaUser className={PeopleDetailsStyle.icon} />
            <strong>Name:</strong> {props.selectedPeopledata.name || "N/A"}
          </p>
          <p>
            <FaEnvelope className={PeopleDetailsStyle.icon} />
            <strong>Email:</strong> {props.selectedPeopledata.email || "N/A"}
          </p>
          <p>
            <FaUser className={PeopleDetailsStyle.icon} />
            <strong>Father Name:</strong>{" "}
            {props.selectedPeopledata.fatherName || "N/A"}
          </p>
          <p>
            <FaMobile className={PeopleDetailsStyle.icon} />
            <strong>Mobile:</strong> {props.selectedPeopledata.mobile || "N/A"}
          </p>

          <p>
            <SlCalender className={PeopleDetailsStyle.icon} />
            <strong>Dob:</strong>{" "}
            {props.selectedPeopledata.dob
              ? dayjs(props.selectedPeopledata.dob).isValid()
                ? dayjs(props.selectedPeopledata.dob).format("DD MMM YYYY")
                : "N/A"
              : "N/A"}
          </p>
          <p>
            <FaUser className={PeopleDetailsStyle.icon} />
            <strong>Gender:</strong> {props.selectedPeopledata.gender || "N/A"}
          </p>
        </div>

        <div className={PeopleDetailsStyle.action}>
          <div className={PeopleDetailsStyle.managerToggle}>
            <label>
              <div
                className={`${PeopleDetailsStyle.toggle} 
                                ${
                                  Number(props.empStatus) === 1
                                    ? PeopleDetailsStyle.on
                                    : PeopleDetailsStyle.off
                                }`}
                onClick={() => {
                  handleActiveInactiveUser(props.empStatus); // Call the first function
                  props.setEmpStatus(Number(props.empStatus) === 1 ? 0 : 1); // Toggle the status
                }}
              >
                <div className={PeopleDetailsStyle.toggleCircle}></div>
              </div>
            </label>
            <span
              className={PeopleDetailsStyle.manager}
              style={{ color: Number(props.empStatus) === 1 ? "green" : "red" }}
            >
              {Number(props.empStatus) === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className={PeopleDetailsStyle.action}>
          <div className={PeopleDetailsStyle.managerToggle}>
            <label>
              <div
                className={`${PeopleDetailsStyle.toggle} 
                                ${
                                  isManager
                                    ? PeopleDetailsStyle.on
                                    : PeopleDetailsStyle.off
                                }`}
                onClick={() => {
                  if (isManager) {
                    setRemoveManager(true);
                    setSetManager(false);
                  } else {
                    setSetManager(true);
                    setRemoveManager(false);
                  }
                }}
              >
                <div className={PeopleDetailsStyle.toggleCircle}></div>
              </div>
            </label>
            <span className={PeopleDetailsStyle.manager}>Set As Manager</span>
          </div>
          <div className={PeopleDetailsStyle.actionContainer}>
            <div
              className={PeopleDetailsStyle.iconGroup}
              onClick={handleEditPeople}
            >
              <FaRegEdit className={PeopleDetailsStyle.icon} />
            </div>
          </div>
        </div>

        <AttendanceManager
          activeTab={props.activeTab}
          setActiveTab={props.setActiveTab}
          selectedPeopledata={props.selectedPeopledata}
        />
      </div> */}
      <DialogueBox
        styles={"center"}
        visible={!isManager ? setManager : removeManager}
        title={"Are you sure !!"}
        msg={
          <>
            {setManager ? (
              <>
                You want to make <strong>{props.name}</strong> as a manager?
              </>
            ) : removeManager ? (
              <>
                You want to remove <strong>{props.name}</strong> as a manager?
              </>
            ) : null}
          </>
        }
        onConfirm={!isManager ? handleSetAsManager : handleRemoveAsManager}
        onCancel={() => {
          setSetManager(false);
          setRemoveManager(false);
        }}
        btnOneText={!isManager ? "Approve" : "Remove"}
        btnTwoText={"Cancel"}
        isManager={isManager}
      />
      {props.isEdit && (
        <EmployeePersonalDetails
          show={openPersonalDetailsWindow}
          setShow={setOpenPersonalDetailsWindow}
          selectedPeopledata={props.selectedPeopledata}
          isEdit={props.isEdit}
          setIsEdit={props.setIsEdit}
          setTriggerList={props.setTriggerList}
        />
      )}
    </>
  );
};

export default PersonalDetails;
