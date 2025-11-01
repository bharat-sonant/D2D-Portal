import { useEffect, useState } from "react";
import styles from "../../assets/css/Employee/EmployementDetails.module.css";
import { images } from "../../assets/css/imagePath";
import {
  changeEmployeeStatusActiveAndInactive,
  updateEmployeeMobileAccess
} from "../../services/Employee/EmployeeService";
import DialogueBox from "./DialogueBox";
import { setAlertMessage } from "../../common/common";

const EmployeeDetails = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [activeEmp, setActiveEmp] = useState(false);
  const [inactiveEmp, setInactiveEmp] = useState(false);
  const [canAccessMobileApp, setCanAccessMobileApp] = useState(false);

  useEffect(() => {
    if (props.employeeDetails.status) {
      Number(props.employeeDetails.status) === 1
        ? setIsActive(true)
        : setIsActive(false);
    }
  }, [props.employeeDetails.status]);

  useEffect(() => {
    setCanAccessMobileApp(props.employeeDetails.canAccessMobileApp);
  }, [props.employeeDetails.canAccessMobileApp]);

  const handleActiveInactiveUser = (status) => {
    const loggedInUserId = "Admin";
    changeEmployeeStatusActiveAndInactive(
      loggedInUserId,
      props.peopleEmpCode,
      status
    ).then((response) => {
      if (response.status === "success") {
        const removeEmployee = props.employeeData.filter(
          (emp) => emp.empCode !== props.peopleEmpCode
        );
        const updatedEmployees = props.allEmployeeData.map((emp) =>
          emp.empCode === props.peopleEmpCode ? { ...emp, status } : emp
        );

        props.setFilteredUsers(removeEmployee);
        props.setEmployeeData(removeEmployee);
        props.setAllEmployeeData(updatedEmployees);

        setActiveEmp(false);
        setInactiveEmp(false);
        setIsActive(status === 1);
        const statusText = status === 1 ? "active" : "inactive";
        setAlertMessage("success", `Employee successfully ${statusText}.`);
      } else {
        setAlertMessage("error", "Failed to update employee status. Please try again.");
      }
    });
  };

  const handleToggleClick = () => {
    if (Number(props.employeeDetails.status) === 1) {
      setInactiveEmp(true);
      setActiveEmp(false);
    } else {
      setActiveEmp(true);
      setInactiveEmp(false);
    }
  };

  const handleConfirmStatusChange = () => {
    const newStatus =
      Number(props.employeeDetails.status) === 1 ? 2 : 1;
    handleActiveInactiveUser(newStatus);
  };

  const handleAccessToggle = () => {
    const loggedInUserId = "Admin";
    const newAccessValue = !canAccessMobileApp;
    setCanAccessMobileApp(newAccessValue);
    updateEmployeeMobileAccess(loggedInUserId, props.peopleEmpCode, newAccessValue)
      .then((response) => {
        if (response.status === "success") {
          // Update in parent data list if needed
          const updatedList = props.allEmployeeData.map(emp =>
            emp.empCode === props.peopleEmpCode
              ? { ...emp, canAccessMobileApp: newAccessValue }
              : emp
          );
          props.setAllEmployeeData(updatedList);

          setAlertMessage(
            "success",
            `Mobile app access ${newAccessValue ? "granted" : "revoked"} successfully.`
          );
        } else {
          setCanAccessMobileApp(!newAccessValue);
          setAlertMessage("error", "Failed to update mobile app access.");
        }
      })
      .catch(() => {
        setCanAccessMobileApp(!newAccessValue);
        setAlertMessage("error", "Error updating mobile app access.");
      });

  };

  return (
    <>
      <div className={`${styles.defaultBG}`}>
        <div className={`${styles.defaultHeader}`}>
          <div className={`${styles.defaultHeaderLeft}`}>Employment Detail</div>
          {Number(props.employeeDetails.status) === 1 && (
            <div className={`${styles.defaultHeaderRight}`} onClick={() => props.handleEdit(props.employeeDetails)}>
              <img
                src={images.iconEdit}
                className={`img-fluid ${styles.iconEdit}`}
                title="Edit"
                alt="icon"
              />
            </div>
          )}
        </div>

        <div className={`${styles.commonBody}`}>
          <ul className={`${styles.commonBodyUL}`}>
            <li className={`${styles.commonBodyLi}`} title="Employee Code">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconId}`}
                  className={`${styles.iconDefault}`}
                  title="Employee Code"
                  alt="icon"
                />
              </div>
              <div className={`${styles.detailsRight}`}>
                {props.peopleEmpCode || "N/A"}
              </div>
            </li>

            <li className={`${styles.commonBodyLi}`} title="Name">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconUser}`}
                  className={`${styles.iconDefault}`}
                  title="Name"
                  alt="icon"
                />
              </div>
              <div className={`${styles.detailsRight}`}>
                {props.employeeDetails.name || "N/A"}
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
                {props.employeeDetails.email || "N/A"}
              </div>
            </li>

            <li
              className={`${styles.commonBodyLi}`}
              title="Status"
              style={{ paddingBottom: "0px" }}
            >
              <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
                <div className={`${styles.infoRight} ${styles.infoManager}`}>
                  <div
                    className={`${styles.userDesignation}`}
                    style={{
                      color:
                        Number(props.employeeDetails.status) === 1
                          ? "green"
                          : "red",
                    }}
                  >
                    {Number(props.employeeDetails.status) === 1
                      ? "Active"
                      : "Inactive"}
                  </div>
                  <div className={`${styles.managerToggle}`}>
                    <div
                      className={`${styles.toggle} ${Number(props.employeeDetails.status) === 1
                        ? styles.on
                        : styles.off
                        }`}
                      onClick={handleToggleClick}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className={`${styles.commonBodyLi}`} title="Mobile App Access">
              <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
                <div className={`${styles.infoRight} ${styles.infoManager}`}>
                  <div className={`${styles.userDesignation}`}>
                    Provide IEC mobile app permission
                  </div>
                  <div className={`${styles.managerToggle}`}>
                    <div
                      className={`${styles.toggle} ${canAccessMobileApp ? styles.on : styles.off}`}
                      onClick={handleAccessToggle}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>

                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <DialogueBox
        styles={"center"}
        visible={activeEmp || inactiveEmp}
        title={"Are you sure !!"}
        msg={
          <>
            {activeEmp && (
              <>
                You want to Active{" "}
                <strong>{props.employeeDetails.name}</strong>?
              </>
            )}
            {inactiveEmp && (
              <>
                You want to Inactive{" "}
                <strong>{props.employeeDetails.name}</strong>?
              </>
            )}
          </>
        }
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setActiveEmp(false);
          setInactiveEmp(false);
        }}
        btnOneText={
          Number(props.employeeDetails.status) === 1 ? "Inactive" : "Active"
        }
        btnTwoText={"Cancel"}
      />
    </>
  );
};

export default EmployeeDetails;
