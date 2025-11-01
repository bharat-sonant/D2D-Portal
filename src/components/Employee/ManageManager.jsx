import { useEffect, useState } from "react";
import styles from "../../assets/css/Employee/EmployementDetails.module.css";
import DialogueBox from "../Attendance/DialogueBox.jsx";
import { checkAttendanceApproveOrNot, removeFromManager, setAsManager } from "../../services/Employee/AttendanceManagerService.js";
import EmployeePersonalDetails from "./EmployeePersonalDetails.jsx";
import AttendanceManager from "./AttendanceManager.jsx";
import ExpenseApproveManager from "./ExpenseApproveManager.jsx";
import { checkExpenseApproveOrNot, checkExpenseReimburseOrNot, checkExpenseReviewerOrNot, removeFromExpenseApproverManager, removeFromExpenseReimburseManager, removeFromExpenseReviewer, setAsExpenseApproverManager, setAsExpenseReimburseManager, SetAsExpenseReviewerService } from "../../services/Employee/ExpenseManagerService.js";
import ReimburseManager from "./ReimburseManager.jsx";
import ExpenseReviewers from "./ExpenseReviewers.jsx";
import { setAlertMessage } from "../../common/common.js";
import IsOwnerAlert from "./IsOwnerAlert.jsx";
import { getEmployeePermissionData } from "../../services/Permission/PermissonServices.js";

const ManageManager = (props) => {
  const companyName = localStorage.getItem("company");
  const [openPersonalDetailsWindow, setOpenPersonalDetailsWindow] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [setManager, setSetManager] = useState(false);
  const [removeManager, setRemoveManager] = useState(false);
  const [isActive, setIsActive] = useState(false)
  const [activeEmp, setActiveEmp] = useState(false)
  const [inactiveEmp, setInactiveEmp] = useState(false)

  const [setAsExpenseManager, setSetAsExpenseManager] = useState(false);
  const [removeExpenseManager, setRemoveExpenseManager] = useState(false);
  const [isExpenseManager, setIsExpenseManager] = useState(false);

  // For Expense Reviewer
  const [asExpenseReviewer, SetAsExpenseReviewer] = useState(false)
  const [removeAsExpenseReviewer, setRemoveAsExpenseReviewer] = useState(false)
  const [isExpenseReviewer, setIsExpenseReviewer] = useState(false);

  const [setReimburseExpense, setSetReimburseExpense] = useState(false);
  const [removeReimburseExpense, setRemoveReimburseExpense] = useState(false);
  const [isReimburseManager, setIsReimburseManager] = useState(false);

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [expenseReimburseCheckboxPermissions, setExpenseReimburseCheckboxPermissions] = useState({ CanAccessExpenseReimbursepage: false });
  const [expenseApproveCheckboxPermissions, setExpenseApproveCheckboxPermissions] = useState({ CanAccessExpenseApprovepage: false });

  const [alertWindow, setAlertWindow] = useState(false)
  let owner = localStorage.getItem("isOwner");
  let empCode = localStorage.getItem("empCode");
  let companyCode = localStorage.getItem("companyCode");

  useEffect(() => {
    if (props.empStatus) {
      Number(props.empStatus) === 1 ? setIsActive(false) : setIsActive(true)
    }

    if (owner === "Yes") {
      setLoggedInUserId("Owner");
    } else {
      setLoggedInUserId(empCode || null);
    }
  }, [owner, empCode, props.empStatus]);

  useEffect(() => {
    setSetManager(false);
    setRemoveManager(false);
  }, [props.peopleEmpCode]);

  useEffect(() => {
    setSetAsExpenseManager(false);
    setRemoveExpenseManager(false);
  }, [props.peopleEmpCode])

  useEffect(() => {
    if (props.peopleEmpCode) {
   
    }
  }, [props.peopleEmpCode, props.triggerList]);

  useEffect(() => {
    if (companyName && props.peopleEmpCode) {
      getEmployeePermissionData(companyName, props.peopleEmpCode, (data) => {
        setExpenseApproveCheckboxPermissions({
          CanAccessExpenseApprovepage: data?.CanAccessExpenseApprovepage || false
        });
        setExpenseReimburseCheckboxPermissions({
          CanAccessExpenseReimbursepage: data?.CanAccessExpenseReimbursepage || false
        });
      });
    }
  }, [companyName, props.peopleEmpCode, props.triggerList]);


  // useEffect(() => {
  //   if (!expenseApproveCheckboxPermissions.CanAccessExpenseApprovepage && isExpenseManager) {
  //     handleRemoveExpenseManager();
  //     setAlertMessage('error', `${props.name} no longer has access to the Expense Approver page, so they have been removed as a manager.`);
  //   }
  // }, [expenseApproveCheckboxPermissions.CanAccessExpenseApprovepage, props.peopleEmpCode]);

  // useEffect(() => {
  //   if (!expenseReimburseCheckboxPermissions.CanAccessExpenseReimbursepage && isReimburseManager) {
  //     handleRemoveReimburseManager();
  //     setAlertMessage('error', `${props.name} no longer has access to the Expense Reimburse page, so they have been removed as a manager.`);
  //   }
  // }, [expenseReimburseCheckboxPermissions.CanAccessExpenseReimbursepage, props.peopleEmpCode]);

  const handleEditPeople = () => {
    props.setIsEdit(true);
    setOpenPersonalDetailsWindow(true);
  };

  // For Manager
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

  // For Expense Approve Manager
  const handleExpenseApproveManager = () => {
    if (!expenseApproveCheckboxPermissions.CanAccessExpenseApprovepage) {
      setAlertMessage(
        'error',
        `${props.name} currently does not have access to the Expense Approver page. Please grant access before assigning them as a manager.`
      );
      return;
    }

    setAsExpenseApproverManager(companyName, props.peopleEmpCode, props.name)
      .then((response) => {
        if (response === "success") {
          setIsExpenseManager(true);
          setRemoveExpenseManager(false);
          setSetAsExpenseManager(false);
        }
      })
      .catch(() => {
        setAlertMessage("error", "Something went wrong while assigning the expense approver role.");
      });
  };


  const handleRemoveExpenseManager = () => {
    removeFromExpenseApproverManager(companyName, props.peopleEmpCode).then((response) => {
      if (response === "success") {
        setIsExpenseManager(false);
        setRemoveExpenseManager(false);
      }
    })
  }

  // for Expense Reviewer
  const handleExpenseReviewer = () => {
    SetAsExpenseReviewerService(companyName, props.peopleEmpCode, props.name).then((response) => {
      if (response === "success") {
        setIsExpenseReviewer(true);
        setRemoveAsExpenseReviewer(false);
        SetAsExpenseReviewer(false)
      }
    })
  }

  const handleRemoveExpenseReviewer = () => {
    removeFromExpenseReviewer(companyName, props.peopleEmpCode).then((response) => {
      if (response === "success") {
        setIsExpenseReviewer(false);
        setRemoveAsExpenseReviewer(false);
      }
    })
  }

  // for Expense ReimburseManager
  const handleExpenseReimburseManager = () => {
    if (!expenseReimburseCheckboxPermissions.CanAccessExpenseReimbursepage) {
      setAlertMessage(
        'error',
        `${props.name} currently does not have access to the Expense Reimburse page. Please grant access before assigning them as a manager.`
      );
      return;
    }

    setAsExpenseReimburseManager(companyName, props.peopleEmpCode, props.name)
      .then((response) => {
        if (response === "success") {
          setIsReimburseManager(true);
          setRemoveReimburseExpense(false);
          setSetReimburseExpense(false);
        }
      })
      .catch(() => {
        setAlertMessage("error", "Something went wrong while assigning the reimburse manager role.");
      });
  };

  const handleRemoveReimburseManager = () => {
    removeFromExpenseReimburseManager(companyName, props.peopleEmpCode).then((response) => {
      if (response === "success") {
        setIsReimburseManager(false);
        setRemoveReimburseExpense(false);
      }
    })
  }

  const handleActiveInactiveUser = (status) => {
  };

  const checkUserISOwner = async () => {
  }

  function closeAlertWindow() {
    setAlertWindow(false)
  }
  return (
    <>
      <div className={`${styles.defaultBG} `}>
        <div className={`${styles.defaultHeader} ${styles.permissionHeader}`}>
          <div className={`${styles.defaultHeaderLeft}`}>Manage Permission</div>
        </div>
        <div className={`${styles.pageRow} ${styles.pagePermissionRow}`}>
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <div
                className={`${styles.userDesignation}`}
                style={{
                  color: Number(props.empStatus) === 1 ? "green" : "red",
                }}
              >
                {Number(props.empStatus) === 1 ? "Active" : "Inactive"}
              </div>
              <div className={`${styles.managerToggle}`}>
                <label>
                  <div
                    className={`${styles.toggle} 
                                ${Number(props.empStatus) === 1
                        ? styles.on
                        : styles.off
                      }`}
                    onClick={() => {
                      if (Number(props.empStatus) === 1) {
                        checkUserISOwner()
                      } else {
                        setActiveEmp(true);
                        setInactiveEmp(false);
                      }
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <div className={`${styles.userDesignation}`}>Set as Attendance Managers</div>
              <div className={`${styles.managerToggle}`}>
                <label>
                  <div
                    className={`${styles.toggle} 
                                ${isManager
                        ? styles.on
                        : styles.off
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
                    <div className={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/*Expense approve manager */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <div className={`${styles.userDesignation}`}>Set as Expense Approve Managers</div>
              <div className={`${styles.managerToggle}`}>
                <label>
                  <div
                    className={`${styles.toggle} 
                                ${isExpenseManager
                        ? styles.on
                        : styles.off
                      }`}
                    onClick={() => {
                      if (isExpenseManager) {
                        setRemoveExpenseManager(true);
                        setSetAsExpenseManager(false);
                      } else {
                        setSetAsExpenseManager(true);
                        setRemoveExpenseManager(false);
                      }
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Expense Reviewer  */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <div className={`${styles.userDesignation}`}>Set as Expense Reviewer </div>
              <div className={`${styles.managerToggle}`}>
                <label>
                  <div
                    className={`${styles.toggle} 
                                ${isExpenseReviewer
                        ? styles.on
                        : styles.off
                      }`}
                    onClick={() => {
                      if (isExpenseReviewer) {
                        setRemoveAsExpenseReviewer(true);
                        SetAsExpenseReviewer(false);
                      } else {
                        SetAsExpenseReviewer(true);
                        setRemoveAsExpenseReviewer(false);
                      }
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/*Expense Reimburse manager */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <div className={`${styles.userDesignation}`}>Set as Expense Reimburse Managers</div>
              <div className={`${styles.managerToggle}`}>
                <label>
                  <div
                    className={`${styles.toggle} 
                                ${isReimburseManager
                        ? styles.on
                        : styles.off
                      }`}
                    onClick={() => {
                      if (isReimburseManager) {
                        setRemoveReimburseExpense(true);
                        setSetReimburseExpense(false);
                      } else {
                        setSetReimburseExpense(true);
                        setRemoveReimburseExpense(false);
                      }
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <AttendanceManager
                activeTab={props.activeTab}
                setActiveTab={props.setActiveTab}
                selectedPeopledata={props.selectedPeopledata}
              />
            </div>
          </div>

          {/*Expense approve manager */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <ExpenseApproveManager
                activeTab={props.activeTab}
                setActiveTab={props.setActiveTab}
                selectedPeopledata={props.selectedPeopledata}
              />
            </div>
          </div>

          {/*Expense Reviewer  */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <ExpenseReviewers
                activeTab={props.activeTab}
                setActiveTab={props.setActiveTab}
                selectedPeopledata={props.selectedPeopledata}
              />
            </div>
          </div>

          {/*Expense Reimburse manager */}
          <div className={`${styles.infoRow} ${styles.infoRowPermission}`}>
            <div className={`${styles.infoRight} ${styles.infoManager}`}>
              <ReimburseManager
                activeTab={props.activeTab}
                setActiveTab={props.setActiveTab}
                selectedPeopledata={props.selectedPeopledata}
              />
            </div>
          </div>
        </div>
      </div>

      <DialogueBox
        styles={"center"}
        visible={!isActive ? inactiveEmp : activeEmp}
        title={"Are you sure !!"}
        msg={
          <>
            {activeEmp ? (
              <>
                You want to Active <strong>{props.name}</strong>?
              </>
            ) : inactiveEmp ? (
              <>
                You want to Inactive <strong>{props.name}</strong> ?
              </>
            ) : null}
          </>
        }
        onConfirm={() => handleActiveInactiveUser(props.empStatus)}
        onCancel={() => {
          setActiveEmp(false);
          setInactiveEmp(false);
        }}
        btnOneText={!isActive ? "Inactive" : "Active"}
        btnTwoText={"Cancel"}
        isManager={!isActive}
      />

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
      {/* Expense Manager   */}
      <DialogueBox
        styles={"center"}
        visible={!isExpenseManager ? setAsExpenseManager : removeExpenseManager}
        title={"Are you sure !!"}
        msg={
          <>
            {setAsExpenseManager ? (
              <>
                You want to make <strong>{props.name}</strong> as a expense approve manager?
              </>
            ) : removeExpenseManager ? (
              <>
                You want to remove <strong>{props.name}</strong> as a expense approve manager?
              </>
            ) : null}
          </>
        }
        onConfirm={!isExpenseManager ? handleExpenseApproveManager : handleRemoveExpenseManager}
        onCancel={() => {
          setSetAsExpenseManager(false);
          setRemoveExpenseManager(false);
        }}
        btnOneText={!isExpenseManager ? "Approve" : "Remove"}
        btnTwoText={"Cancel"}
        isManager={isExpenseManager}
      />

      {/* Expense Reviewer  */}
      <DialogueBox
        styles={"center"}
        visible={!isExpenseReviewer ? asExpenseReviewer : removeAsExpenseReviewer}
        title={"Are you sure !!"}
        msg={
          <>
            {asExpenseReviewer ? (
              <>
                You want to make <strong>{props.name}</strong> as a expense reviewer?
              </>
            ) : removeAsExpenseReviewer ? (
              <>
                You want to remove <strong>{props.name}</strong> as a expense reviewer?
              </>
            ) : null}
          </>
        }
        onConfirm={!isExpenseReviewer ? handleExpenseReviewer : handleRemoveExpenseReviewer}
        onCancel={() => {
          SetAsExpenseReviewer(false);
          setRemoveAsExpenseReviewer(false);
        }}
        btnOneText={!isExpenseReviewer ? "Approve" : "Remove"}
        btnTwoText={"Cancel"}
        isManager={isExpenseReviewer}
      />
      {/* Reimburse Manager  */}
      <DialogueBox
        styles={"center"}
        visible={!isReimburseManager ? setReimburseExpense : removeReimburseExpense}
        title={"Are you sure !!"}
        msg={
          <>
            {setReimburseExpense ? (
              <>
                You want to make <strong>{props.name}</strong> as a reimburse manager?
              </>
            ) : removeReimburseExpense ? (
              <>
                You want to remove <strong>{props.name}</strong> as a reimburse manager?
              </>
            ) : null}
          </>
        }
        onConfirm={!isReimburseManager ? handleExpenseReimburseManager : handleRemoveReimburseManager}
        onCancel={() => {
          setSetReimburseExpense(false);
          setRemoveReimburseExpense(false);
        }}
        btnOneText={!isReimburseManager ? "Approve" : "Remove"}
        btnTwoText={"Cancel"}
        isManager={isReimburseManager}
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

      {alertWindow && (
        <IsOwnerAlert show={alertWindow} handleClose={closeAlertWindow} />
      )

      }
    </>
  );
};

export default ManageManager;