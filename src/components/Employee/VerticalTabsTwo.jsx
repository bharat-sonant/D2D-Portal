import React, { useEffect, useState } from "react";
import styles from "../../assets/css/Employee/VerticalTab.module.css";
import {
  getPermissionData,
  SaveDashBoardPermissions,
} from "../../actions/DashboardAction/PermissionDashboardAction";
import {
  getEmployeePermissionData,
  getHolidayPermissionsOnValue,
  saveAttendancePermissionData,
  saveEmployeePermissionData,
  saveExpenseApprovePermissionData,
  saveExpenseCategoryPermissionData,
  saveExpensePermissionData,
  saveExpenseReimbursePermissionData,
  saveExpenseReportPermissionData,
  saveHolidayPermissionData,
  saveTicketRaisePermissionData,
} from "../../services/Permission/PermissonServices";
import StatePermissionsPopUP from "./StatePermissionsPopUP";

const VerticalTabsTwo = (props) => {
  const [activeTab, setActiveTab] = useState(1);
  const [activePopUp, setActivePopUp] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState("");
  // this state for expense dashboard
  const [expenseSelectedDashBoard, setExpenseSelectedDashBoard] = useState("");
  const [checkboxPermissions, setCheckboxPermissions] = useState({
    canAccessHoliday: false,
    canAddHoliday: false,
    canEditHoliday: false,
    canDeleteHoliday: false,
  });
  const [employeecheckboxpermissions, setEmployeeCheckboxPermissions] =
    useState({
      canAccessEmployeePage: false,
      canAddEmployee: false,
      cangivePermissions: false,
    });

  const [branchCheckboxPermissions, setBranchCheckboxPermissions] = useState({
    canAddBranch: false,
    canEditBranch: false,
    canAccessBranchpage: false,
    canChangeStatus: false,
  });

  const [projectCheckboxPermissions, setProjectCheckboxPermissions] = useState({
    canAccessProjectPage: false,
    canAddProject: false,
    canEditProject: false,
    canDeleteProject: false,
  });

  const [attendanceCheckboxPermissions, setAttendanceCheckboxPermissions] =
    useState({
      CanMarkAttendanceThorughMobile: false,
      CanMarkAttendancethorughDesktop: false,
    });

  const [
    attendanceApproveCheckboxPermissions,
    setAttendanceApproveCheckboxPermissions,
  ] = useState({
    CanAccessApproveAttendancePage: false,
    CanAccessLeaveApprovalPage: false,
    CanAccessModificationApprovalPage: false,
  });

  const [
    expenseCategoryCheckboxPermissions,
    setExpenseCategoryCheckboxPermissions,
  ] = useState({
    CanAccessExpenseCategory: false,
    CanAddExpenseCategory: false,
    CanEditExpenseCategory: false,
    CanDeletExpenseCategory: false,
    CanChangeStatusOfExpenseCategory: false,
    CanCheckInActiveExpenseCategory: false,
  });

  const [expenseCheckboxPermissions, setExpenseCheckboxPermissions] = useState({
    CanAccessExpensepage: false,
    CanAccessExpenseReportPage: false,
    CanAccessDuplicateExpenseReportPage:false,
  });

  const [
    expenseReimburseCheckboxPermissions,
    setExpenseReimburseCheckboxPermissions,
  ] = useState({
    CanAccessExpenseReimbursepage: false,
  });

  const [
    expenseApproveCheckboxPermissions,
    setExpenseApproveCheckboxPermissions,
  ] = useState({
    CanAccessExpenseApprovepage: false,
  });

  const [departmentPermission, SetDepartmentPermission] = useState({
    canAccessDepartmentPage: false,
    canAddDepartment: false,
    canEditDepartment: false,
    canDeleteDepartment: false,
    canViewEditHistory: false,
    canAddDesignation: false,
    canEditDesignation: false,
    canDeleteDesignation: false,
  });

  const [TaskPagePermission, setTaskPagePermission] = useState({
    canAccessTaskPage: false,
  });
  const [SaleFeedbackPermission, setSaleFeedbackPermission] = useState({
    canAccessSaleFeedbackPage: false,
    canAddSaleFeedback: false,
  });

  const [TicketRaisePermission, setTicketRaisePermission] = useState({
    canAccessTicketRaisePage: false,
    canAddTicket: false,
    canEditTicket: false,
    canDeleteTicket: false,
  });
  let Company = localStorage.getItem("company");

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  /* This useEffect is used for get dashboard permissions */
  useEffect(() => {
    if (Company && props.peopleEmpCode) {
      getPermissionData(Company, props.peopleEmpCode, setSelectedDashboard);
    }
  }, [Company, props.peopleEmpCode]);

  /* This useEffect is used for get holiday permissions */
  useEffect(() => {
    if (Company && props.peopleEmpCode) {
      getHolidayPermissionsOnValue(Company, props.peopleEmpCode, (data) => {
        setCheckboxPermissions({
          canAccessHoliday: data?.canAccessHoliday || false,
          canAddHoliday: data?.canAddHoliday || false,
          canEditHoliday: data?.canEditHoliday || false,
          canDeleteHoliday: data?.canDeleteHoliday || false,
        });
      });
    }
  }, [Company, props.peopleEmpCode]);

  useEffect(() => {
    if (Company && props.peopleEmpCode) {
      getEmployeePermissionData(Company, props.peopleEmpCode, (data) => {
        setEmployeeCheckboxPermissions({
          canAccessEmployeePage: data?.canAccessEmployeePage || false,
          canAddEmployee: data?.canAddEmployee || false,
          cangivePermissions: data?.cangivePermissions || false,
        });
        setBranchCheckboxPermissions({
          canAddBranch: data?.canAddBranch || false,
          canEditBranch: data?.canEditBranch || false,
          canAccessBranchpage: data?.canAccessBranchpage || false,
          canChangeStatus: data?.canChangeStatus || false,
        });
        setProjectCheckboxPermissions({
          canAccessProjectPage: data?.canAccessProjectPage || false,
          canAddProject: data?.canAddProject || false,
          canEditProject: data?.canEditProject || false,
          canDeleteProject: data?.canDeleteProject || false,
        });
        setAttendanceCheckboxPermissions({
          CanMarkAttendanceThorughMobile:
            data?.canMarkAttendanceThorughMobile || false,
          CanMarkAttendancethorughDesktop:
            data?.canMarkAttendancethorughDesktop || false,
        });
        setExpenseCategoryCheckboxPermissions({
          CanAccessExpenseCategory: data?.CanAccessExpenseCategory || false,
          CanAddExpenseCategory: data?.CanAddExpenseCategory || false,
          CanEditExpenseCategory: data?.CanEditExpenseCategory || false,
          CanDeletExpenseCategory: data?.CanDeletExpenseCategory || false,
          CanChangeStatusOfExpenseCategory:
            data?.CanChangeStatusOfExpenseCategory || false,
          CanCheckInActiveExpenseCategory:
            data?.CanCheckInActiveExpenseCategory || false,
        });
        // this state for expense dashboard
        setExpenseSelectedDashBoard(data?.expenseDashboard || "");
        setExpenseCheckboxPermissions({
          CanAccessExpensepage: data?.CanAccessExpensepage || false,
          CanAccessExpenseReportPage: data?.CanAccessExpenseReportPage || false,
          CanAccessDuplicateExpenseReportPage:data?.CanAccessDuplicateExpenseReportPage || false,
        });
        setExpenseApproveCheckboxPermissions({
          CanAccessExpenseApprovepage:
            data?.CanAccessExpenseApprovepage || false,
        });
        setExpenseReimburseCheckboxPermissions({
          CanAccessExpenseReimbursepage:
            data?.CanAccessExpenseReimbursepage || false,
        });
        setAttendanceApproveCheckboxPermissions({
          CanAccessApproveAttendancePage:
            data?.CanAccessApproveAttendancePage || false,
          CanAccessLeaveApprovalPage: data?.CanAccessLeaveApprovalPage || false,
          CanAccessModificationApprovalPage:
            data.CanAccessModificationApprovalPage || false,
        });
        SetDepartmentPermission({
          canAccessDepartmentPage: data.canAccessDepartmentPage || false,
          canAddDepartment: data.canAddDepartment || false,
          canEditDepartment: data.canEditDepartment || false,
          canDeleteDepartment: data.canDeleteDepartment || false,
          canViewEditHistory: data.canViewEditHistory || false,
          canAddDesignation: data.canAddDesignation || false,
          canEditDesignation: data.canEditDesignation || false,
          canDeleteDesignation: data.canDeleteDesignation || false,
        });
        setTaskPagePermission({
          canAccessTaskPage: data.canAccessTaskPage || false,
        });
        setSaleFeedbackPermission({
          canAccessSaleFeedbackPage: data.canAccessSaleFeedbackPage || false,
          canAddSaleFeedback: data.canAddSaleFeedback || false,
        });
        setTicketRaisePermission({
          canAccessTicketRaisePage: data.canAccessTicketRaisePage || false,
          canAddTicket: data.canAddTicket || false,
          canEditTicket: data.canEditTicket || false,
          canDeleteTicket: data.canDeleteTicket || false,
        });
      });
    }
  }, [Company, props.peopleEmpCode]);
  /* This is used for select dashboard permissions */
  const handleDashBoardSelection = (value) => {
    setSelectedDashboard(value);
    SaveDashBoardPermissions(Company, props.peopleEmpCode, value);
  };

  /* This handleCheckboxChange is used for select holiday permissions */
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let permissionObj = {};
    permissionObj[value] = checked;
    saveHolidayPermissionData(Company, props.peopleEmpCode, permissionObj);
  };

  /* this handleEmployeeCheckboxChange is used for select employee permissions */
  const handleEmployeeCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setEmployeeCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let EmployeepermissionObj = {};
    EmployeepermissionObj[value] = checked;
    saveEmployeePermissionData(
      Company,
      props.peopleEmpCode,
      EmployeepermissionObj
    );
  };

  /*   This handleBranchCheckboxChange is used for select branch permission  */
  const handleBranchCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setBranchCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let BranchpermissionObj = {};
    BranchpermissionObj[value] = checked;
    saveEmployeePermissionData(
      Company,
      props.peopleEmpCode,
      BranchpermissionObj
    );
  };

  const handleProjectCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setProjectCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let projectpermissionObj = {};
    projectpermissionObj[value] = checked;
    saveEmployeePermissionData(
      Company,
      props.peopleEmpCode,
      projectpermissionObj
    );
  };

  const handleAttendanceCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setAttendanceCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let AttendancepermissionObj = {};
    AttendancepermissionObj[value] = checked;

    saveAttendancePermissionData(
      Company,
      props.peopleEmpCode,
      AttendancepermissionObj
    );
  };

  const handleAttendanceApproveCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setAttendanceApproveCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let AttendancepermissionObj = {};
    AttendancepermissionObj[value] = checked;

    saveAttendancePermissionData(
      Company,
      props.peopleEmpCode,
      AttendancepermissionObj
    );
  };

  const handleTaskPageCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTaskPagePermission((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let AttendancepermissionObj = {};
    AttendancepermissionObj[value] = checked;

    saveAttendancePermissionData(
      Company,
      props.peopleEmpCode,
      AttendancepermissionObj
    );
  };

  const handleDepartmentCheckboxChange = (event) => {
    const { value, checked } = event.target;
    SetDepartmentPermission((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let AttendancepermissionObj = {};
    AttendancepermissionObj[value] = checked;

    saveAttendancePermissionData(
      Company,
      props.peopleEmpCode,
      AttendancepermissionObj
    );
  };

  const handleExpenseCategoryCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setExpenseCategoryCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let ExpenseCategorypermissionObj = {};
    ExpenseCategorypermissionObj[value] = checked;
    saveExpenseCategoryPermissionData(
      Company,
      props.peopleEmpCode,
      ExpenseCategorypermissionObj
    );
  };

 
  /*   This handleExpenseDashBoardSelection is used for select expense dashboard permission  */
  const handleExpenseDashBoardSelection = (value) => {
    setExpenseSelectedDashBoard(value);
    saveExpensePermissionData(Company, props.peopleEmpCode, {
      expenseDashboard: value,
    });
  };

  const handleExpenseCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setExpenseCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let expenseCheckbox = {};
    expenseCheckbox[value] = checked;

    saveExpensePermissionData(Company, props.peopleEmpCode, expenseCheckbox);
  };

  const handleExpenseApproveCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setExpenseApproveCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let expenseApprove = {};
    expenseApprove[value] = checked;

    saveExpenseApprovePermissionData(
      Company,
      props.peopleEmpCode,
      expenseApprove
    );
  };

  const handleExpenseReimburseCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setExpenseReimburseCheckboxPermissions((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let expenseReimburse = {};
    expenseReimburse[value] = checked;

    saveExpenseReimbursePermissionData(
      Company,
      props.peopleEmpCode,
      expenseReimburse
    );
  };

   const handleExpenseReportCheckboxChange = (event) => {
    const {value, checked} = event.target;
    setExpenseCheckboxPermissions((prevPermissions)=>({
      ...prevPermissions,
      [value] : checked,
    }));
     let ExpenseReport = {};
    ExpenseReport[value] = checked;
    saveExpenseReportPermissionData(
      Company,
      props.peopleEmpCode,
      ExpenseReport
    );
  }

  const handleTicketRaiseCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setTicketRaisePermission((prevPermissions) => ({
      ...prevPermissions,
      [value]: checked,
    }));
    let ticketpermissionObj = {};
    ticketpermissionObj[value] = checked;
    saveTicketRaisePermissionData(
      Company,
      props.peopleEmpCode,
      ticketpermissionObj
    );
  };
  const handlePopUpOpen = () => {
    setActivePopUp(true);
  };

  return (
    <div
      className={`${styles.verticalTabsContainer} ${styles.verticalTabsContainerTwo}`}
    >
      <div className={`${styles.verticalTabsHeader}`}>
        <div className={styles.tabHeader}>Permission Access</div>
      </div>
      <div className={`${styles.verticalTabsBody}`}>
        <div className={`${styles.tabs} ${styles.tabsTwo}`}>
          <div
            className={`${styles.tab} ${activeTab === 1 ? styles.active : ""}`}
            onClick={() => handleTabClick(1)}
          >
            Dashboard
          </div>
          <div
            className={`${styles.tab} ${activeTab === 2 ? styles.active : ""}`}
            onClick={() => handleTabClick(2)}
          >
            Attendance
          </div>
          <div
            className={`${styles.tab} ${activeTab === 3 ? styles.active : ""}`}
            onClick={() => handleTabClick(3)}
          >
            Approve Attendance
          </div>
          <div
            className={`${styles.tab} ${activeTab === 4 ? styles.active : ""}`}
            onClick={() => handleTabClick(4)}
          >
            Holiday
          </div>
          <div
            className={`${styles.tab} ${activeTab === 5 ? styles.active : ""}`}
            onClick={() => handleTabClick(5)}
          >
            Employee
          </div>

          <div
            className={`${styles.tab} ${activeTab === 6 ? styles.active : ""}`}
            onClick={() => handleTabClick(6)}
          >
            Branch
          </div>
          <div
            className={`${styles.tab} ${activeTab === 7 ? styles.active : ""}`}
            onClick={() => handleTabClick(7)}
          >
            Department
          </div>
          <div
            className={`${styles.tab} ${activeTab === 8 ? styles.active : ""}`}
            onClick={() => handleTabClick(8)}
          >
            Projects
          </div>
          <div
            className={`${styles.tab} ${activeTab === 9 ? styles.active : ""}`}
            onClick={() => handleTabClick(9)}
          >
            Expense
          </div>
          {/* <div
            className={`${styles.tab} ${activeTab === 10 ? styles.active : ""}`}
            onClick={() => handleTabClick(10)}
          >
            Expense category
          </div> */}
          {/* <div
            className={`${styles.tab} ${activeTab === 11 ? styles.active : ""}`}
            onClick={() => handleTabClick(11)}
          >
            Expense approve
          </div> */}
          {/* <div
            className={`${styles.tab} ${activeTab === 12 ? styles.active : ""}`}
            onClick={() => handleTabClick(12)}
          >
            Expense reimburse
          </div> */}
          <div
            className={`${styles.tab} ${activeTab === 13 ? styles.active : ""}`}
            onClick={() => handleTabClick(13)}
          >
            Task
          </div>
          <div
            className={`${styles.tab} ${activeTab === 14 ? styles.active : ""}`}
            onClick={() => handleTabClick(14)}
          >
            Sales Feedback
          </div>
          <div
            className={`${styles.tab} ${activeTab === 15 ? styles.active : ""}`}
            onClick={() => handleTabClick(15)}
          >
            Ticket Raise
          </div>
        </div>
        <div className={`${styles.tabContent} ${styles.tabContentTwo}`}>
          {/* This is Permissions for Dashboard */}
          {activeTab === 1 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="radio"
                  value="admin"
                  checked={selectedDashboard === "admin"}
                  onChange={(e) => handleDashBoardSelection(e.target.value)}
                />
                Admin Dashboard
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="radio"
                  value="manager"
                  checked={selectedDashboard === "manager"}
                  onChange={(e) => handleDashBoardSelection(e.target.value)}
                />
                Manager Dashboard
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="radio"
                  value="user"
                  checked={selectedDashboard === "user"}
                  onChange={(e) => handleDashBoardSelection(e.target.value)}
                />
                User Dashboard
              </label>
            </div>
          )}

          {activeTab === 2 && (
            <div className={`${styles.permissionRow}`}>
              <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                <div className={`${styles.toggleLeft}`}>
                  <div className={`${styles.toggleText}`}>
                    Allowed for mobile view
                  </div>
                </div>
                <div className={`${styles.toggleRight}`}>
                  <div
                    className={`${styles.toggle} 
                      ${
                        attendanceCheckboxPermissions.CanMarkAttendanceThorughMobile
                          ? styles.on
                          : styles.off
                      }`}
                    onClick={() => {
                      handleAttendanceCheckboxChange({
                        target: {
                          value: "canMarkAttendanceThorughMobile",
                          checked:
                            !attendanceCheckboxPermissions.CanMarkAttendanceThorughMobile,
                        },
                      });
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </div>
              </div>

              <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                <div className={`${styles.toggleLeft}`}>
                  <div className={`${styles.toggleText}`}>
                    Allowed for web browser
                  </div>
                </div>
                <div className={`${styles.toggleRight}`}>
                  <div
                    className={`${styles.toggle} 
        ${
          attendanceCheckboxPermissions.CanMarkAttendancethorughDesktop
            ? styles.on
            : styles.off
        }`}
                    onClick={() => {
                      handleAttendanceCheckboxChange({
                        target: {
                          value: "canMarkAttendancethorughDesktop",
                          checked:
                            !attendanceCheckboxPermissions.CanMarkAttendancethorughDesktop,
                        },
                      });
                    }}
                  >
                    <div className={styles.toggleCircle}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <>
              <div>
                <div className={`${styles.permissionRow}`}>
                  <div
                    className={`${styles.toggleRow} ${styles.permissionCard}`}
                  >
                    <div className={`${styles.toggleLeft}`}>
                      <div className={`${styles.toggleText}`}>
                        Can Access Approve Attandance Page
                      </div>
                    </div>
                    <div className={`${styles.toggleRight}`}>
                      <div
                        className={`${styles.toggle} 
        ${
          attendanceApproveCheckboxPermissions.CanAccessApproveAttendancePage
            ? styles.on
            : styles.off
        }`}
                        onClick={() => {
                          handleAttendanceApproveCheckboxChange({
                            target: {
                              value: "CanAccessApproveAttendancePage",
                              checked:
                                !attendanceApproveCheckboxPermissions.CanAccessApproveAttendancePage,
                            },
                          });
                        }}
                      >
                        <div className={styles.toggleCircle}></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.toggleRow} ${styles.permissionCard}`}
                  >
                    <div className={`${styles.toggleLeft}`}>
                      <div className={`${styles.toggleText}`}>
                        Can Access Leave Approval Page
                      </div>
                    </div>
                    <div className={`${styles.toggleRight}`}>
                      <div
                        className={`${styles.toggle} 
        ${
          attendanceApproveCheckboxPermissions.CanAccessLeaveApprovalPage
            ? styles.on
            : styles.off
        }`}
                        onClick={() => {
                          handleAttendanceApproveCheckboxChange({
                            target: {
                              value: "CanAccessLeaveApprovalPage",
                              checked:
                                !attendanceApproveCheckboxPermissions.CanAccessLeaveApprovalPage,
                            },
                          });
                        }}
                      >
                        <div className={styles.toggleCircle}></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.toggleRow} ${styles.permissionCard}`}
                  >
                    <div className={`${styles.toggleLeft}`}>
                      <div className={`${styles.toggleText}`}>
                        Can Access Modification Approval Page
                      </div>
                    </div>
                    <div className={`${styles.toggleRight}`}>
                      <div
                        className={`${styles.toggle} 
        ${
          attendanceApproveCheckboxPermissions.CanAccessModificationApprovalPage
            ? styles.on
            : styles.off
        }`}
                        onClick={() => {
                          handleAttendanceApproveCheckboxChange({
                            target: {
                              value: "CanAccessModificationApprovalPage",
                              checked:
                                !attendanceApproveCheckboxPermissions.CanAccessModificationApprovalPage,
                            },
                          });
                        }}
                      >
                        <div className={styles.toggleCircle}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* This is Permissions for Holidays */}
          {activeTab === 4 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAccessHoliday"
                  checked={checkboxPermissions.canAccessHoliday}
                  onChange={handleCheckboxChange}
                />
                Can Access Holiday page
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAddHoliday"
                  checked={checkboxPermissions.canAddHoliday}
                  onChange={handleCheckboxChange}
                />
                Can Add Holiday
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canEditHoliday"
                  checked={checkboxPermissions.canEditHoliday}
                  onChange={handleCheckboxChange}
                />
                Can Edit Holiday
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canDeleteHoliday"
                  checked={checkboxPermissions.canDeleteHoliday}
                  onChange={handleCheckboxChange}
                />
                Can Delete Holiday
              </label>
            </div>
          )}

          {/* This is Permissions for Employee */}
          {activeTab === 5 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAccessEmployeePage"
                  checked={employeecheckboxpermissions.canAccessEmployeePage}
                  onChange={handleEmployeeCheckboxChange}
                />
                Can Access Employee Page
              </label>
              <br />
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAddEmployee"
                  checked={employeecheckboxpermissions.canAddEmployee}
                  onChange={handleEmployeeCheckboxChange}
                />
                Can Add Employee
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="cangivePermissions"
                  checked={employeecheckboxpermissions.cangivePermissions}
                  onChange={handleEmployeeCheckboxChange}
                />
                Can Give Permissions
              </label>
            </div>
          )}

          {/* This is Permissions for Branch */}
          {activeTab === 6 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAccessBranchpage"
                  checked={branchCheckboxPermissions.canAccessBranchpage}
                  onChange={handleBranchCheckboxChange}
                />
                Can Access Branch page
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canAddBranch"
                  checked={branchCheckboxPermissions.canAddBranch}
                  onChange={handleBranchCheckboxChange}
                />
                Can Add Branch
              </label>
              <br />
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canEditBranch"
                  checked={branchCheckboxPermissions.canEditBranch}
                  onChange={handleBranchCheckboxChange}
                />
                Can Edit Branch
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="canChangeStatus"
                  checked={branchCheckboxPermissions.canChangeStatus}
                  onChange={handleBranchCheckboxChange}
                />
                Can Active/Inactive Branch
              </label>
            </div>
          )}

          {activeTab === 7 && (
            <>
              {" "}
              <div className={`${styles.permissionRow}`}>
                {" "}
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Access Department Page
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${
          departmentPermission.canAccessDepartmentPage ? styles.on : styles.off
        }`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canAccessDepartmentPage",
                            checked:
                              !departmentPermission.canAccessDepartmentPage,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Add Department
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${departmentPermission.canAddDepartment ? styles.on : styles.off}`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canAddDepartment",
                            checked: !departmentPermission.canAddDepartment,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Edit Department
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${departmentPermission.canEditDepartment ? styles.on : styles.off}`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canEditDepartment",
                            checked: !departmentPermission.canEditDepartment,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Delete Department
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
            ${
              departmentPermission.canDeleteDepartment ? styles.on : styles.off
            }`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canDeleteDepartment",
                            checked: !departmentPermission.canDeleteDepartment,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can View Edit History
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
            ${
              departmentPermission.canViewEditHistory ? styles.on : styles.off
            }`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canViewEditHistory",
                            checked: !departmentPermission.canViewEditHistory,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Add Designation
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
            ${departmentPermission.canAddDesignation ? styles.on : styles.off}`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canAddDesignation",
                            checked: !departmentPermission.canAddDesignation,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Edit Designation
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
            ${
              departmentPermission.canEditDesignation ? styles.on : styles.off
            }`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canEditDesignation",
                            checked: !departmentPermission.canEditDesignation,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Delete Designation
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
            ${
              departmentPermission.canDeleteDesignation ? styles.on : styles.off
            }`}
                      onClick={() => {
                        handleDepartmentCheckboxChange({
                          target: {
                            value: "canDeleteDesignation",
                            checked: !departmentPermission.canDeleteDesignation,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeTab === 8 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canAccessProjectPage"
                  checked={projectCheckboxPermissions.canAccessProjectPage}
                  onChange={handleProjectCheckboxChange}
                />
                Can Access Project Page
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canAddProject"
                  checked={projectCheckboxPermissions.canAddProject}
                  onChange={handleProjectCheckboxChange}
                />
                Can Add Project
              </label>

              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canEditProject"
                  checked={projectCheckboxPermissions.canEditProject}
                  onChange={handleProjectCheckboxChange}
                />
                Can Edit Project
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canDeleteProject"
                  checked={projectCheckboxPermissions.canDeleteProject}
                  onChange={handleProjectCheckboxChange}
                />
                Can Delete Project
              </label>
            </div>
          )}
          {activeTab === 9 && (
           <div>
            <div className={styles.permissionSectionTitle}>Expense</div>
             <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanAccessExpensepage"
                  checked={expenseCheckboxPermissions.CanAccessExpensepage}
                  onChange={handleExpenseCheckboxChange}
                />
                Can Access Expense page
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="CanAccessExpenseReportPage"
                  checked={
                    expenseCheckboxPermissions.CanAccessExpenseReportPage
                  }
                  onChange={handleExpenseReportCheckboxChange}
                />
                Can access expense report page
              </label>
              <label className={`${styles.permissionCard}`}>
                <input
                  type="checkbox"
                  value="CanAccessDuplicateExpenseReportPage"
                  checked={
                    expenseCheckboxPermissions.CanAccessDuplicateExpenseReportPage
                  }
                  onChange={handleExpenseReportCheckboxChange}
                />
                Can access duplicate expense report page
              </label>
              {/* <label
                className={`${styles.permissionCard} `}
              >
                <input
                  type="radio"
                  value="admin"
                  checked={expenseSelectedDashBoard === "admin"}
                  onChange={(e) => handleExpenseDashBoardSelection(e.target.value)}
                />
                Expense Admin Dashboard
              </label> */}
              {/* <label
                className={`${styles.permissionCard} `}
              >
                <input
                  type="radio"
                  value="manager"
                  checked={expenseSelectedDashBoard === "manager"}
                  onChange={(e) => handleExpenseDashBoardSelection(e.target.value)}
                />
                Expense Manager Dashboard
              </label> */}
              {/* <label
                className={`${styles.permissionCard} `}
              >
                <input
                  type="radio"
                  value="user"
                  checked={expenseSelectedDashBoard === "user"}
                  onChange={(e) => handleExpenseDashBoardSelection(e.target.value)}
                />
                Expense User Dashboard
              </label> */}
          {/* Block 2: Expense Category Permissions (was tab 10) */}
           <div className={styles.permissionSectionTitle}>Expense Category</div>
    <div className={`${styles.permissionRow}`}>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanAccessExpenseCategory"
          checked={expenseCategoryCheckboxPermissions.CanAccessExpenseCategory}
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Access Expense Category page
      </label>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanAddExpenseCategory"
          checked={expenseCategoryCheckboxPermissions.CanAddExpenseCategory}
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Add Expense Category
      </label>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanEditExpenseCategory"
          checked={expenseCategoryCheckboxPermissions.CanEditExpenseCategory}
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Edit Expense Category
      </label>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanDeletExpenseCategory"
          checked={expenseCategoryCheckboxPermissions.CanDeletExpenseCategory}
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Delete Expense Category
      </label>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanChangeStatusOfExpenseCategory"
          checked={
            expenseCategoryCheckboxPermissions.CanChangeStatusOfExpenseCategory
          }
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Change Status Of Expense Category
      </label>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanCheckInActiveExpenseCategory"
          checked={
            expenseCategoryCheckboxPermissions.CanCheckInActiveExpenseCategory
          }
          onChange={handleExpenseCategoryCheckboxChange}
        />
        Can Check in-active Expense Category
      </label>
    </div>

    {/* Block 3: Expense Approve Page Permission (was tab 11) */}
    <div className={styles.permissionSectionTitle}>Expense Approve</div>
    <div className={`${styles.permissionRow}`}>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanAccessExpenseApprovepage"
          checked={
            expenseApproveCheckboxPermissions.CanAccessExpenseApprovepage
          }
          onChange={handleExpenseApproveCheckboxChange}
        />
        Can Access Expense Approve page
      </label>
    </div>

    {/* Block 4: Expense Reimburse Page Permission (was tab 12) */}
     <div className={styles.permissionSectionTitle}>Expense Reimburse</div>
    <div className={`${styles.permissionRow}`}>
      <label className={`${styles.permissionCard}`}>
        <input
          type="checkbox"
          value="CanAccessExpenseReimbursepage"
          checked={
            expenseReimburseCheckboxPermissions.CanAccessExpenseReimbursepage
          }
          onChange={handleExpenseReimburseCheckboxChange}
        />
        Can Access Expense Reimburse page
      </label>
    </div>
  </div>
           </div>
)}
          {/* {activeTab === 10 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanAccessExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanAccessExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Access Expense Category page
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanAddExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanAddExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Add Expense Category
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanEditExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanEditExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Edit Expense Category
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanDeletExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanDeletExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Delete Expense Category
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanChangeStatusOfExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanChangeStatusOfExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Change Status Of Expense Category
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanCheckInActiveExpenseCategory"
                  checked={
                    expenseCategoryCheckboxPermissions.CanCheckInActiveExpenseCategory
                  }
                  onChange={handleExpenseCategoryCheckboxChange}
                />
                Can Check in-active Expense Category
              </label>
            </div>
          )}
          {activeTab === 11 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanAccessExpenseApprovepage"
                  checked={
                    expenseApproveCheckboxPermissions.CanAccessExpenseApprovepage
                  }
                  onChange={handleExpenseApproveCheckboxChange}
                />
                Can Access Expense Approve page
              </label>
            </div>
          )}
          {activeTab === 12 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="CanAccessExpenseReimbursepage"
                  checked={
                    expenseReimburseCheckboxPermissions.CanAccessExpenseReimbursepage
                  }
                  onChange={handleExpenseReimburseCheckboxChange}
                />
                Can Access Expense Reimburse page
              </label>
            </div>
          )} */}

          {activeTab === 13 && (
            <>
              <div className={`${styles.permissionRow}`}>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Access Task Page
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${TaskPagePermission.canAccessTaskPage ? styles.on : styles.off}`}
                      onClick={() => {
                        handleTaskPageCheckboxChange({
                          target: {
                            value: "canAccessTaskPage",
                            checked: !TaskPagePermission.canAccessTaskPage,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
              </div>
              {activeTab === 14 && (
                <div className={`${styles.permissionRow}`}>
                  <label className={`${styles.permissionCard}`}>
                    <input
                      type="checkbox"
                      value="canAccessProjectPage"
                      checked={projectCheckboxPermissions.canAccessProjectPage}
                      onChange={handleProjectCheckboxChange}
                    />
                    Can Access Project Page
                  </label>
                  <label className={`${styles.permissionCard}`}>
                    <input
                      type="checkbox"
                      value="canAddProject"
                      checked={projectCheckboxPermissions.canAddProject}
                      onChange={handleProjectCheckboxChange}
                    />
                    Can Add Project
                  </label>
                  <label className={`${styles.permissionCard}`}>
                    <input
                      type="checkbox"
                      value="canEditProject"
                      checked={projectCheckboxPermissions.canEditProject}
                      onChange={handleProjectCheckboxChange}
                    />
                    Can Edit Project
                  </label>
                  <label className={`${styles.permissionCard}`}>
                    <input
                      type="checkbox"
                      value="canDeleteProject"
                      checked={projectCheckboxPermissions.canDeleteProject}
                      onChange={handleProjectCheckboxChange}
                    />
                    Can Delete Project
                  </label>
                </div>
              )}
            </>
          )}
          {activeTab === 14 && (
            <>
              <div className={`${styles.permissionRow}`}>
                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Access Sales Feedback Page
                    </div>
                  </div>
                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${
          SaleFeedbackPermission.canAccessSaleFeedbackPage
            ? styles.on
            : styles.off
        }`}
                      onClick={() => {
                        handleTaskPageCheckboxChange({
                          target: {
                            value: "canAccessSaleFeedbackPage",
                            checked:
                              !SaleFeedbackPermission.canAccessSaleFeedbackPage,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.toggleRow} ${styles.permissionCard}`}>
                  <div className={`${styles.toggleLeft}`}>
                    <div className={`${styles.toggleText}`}>
                      Can Add Sale Feedback
                    </div>
                  </div>

                  <div className={`${styles.toggleRight}`}>
                    <div
                      className={`${styles.toggle} 
        ${SaleFeedbackPermission.canAddSaleFeedback ? styles.on : styles.off}`}
                      onClick={() => {
                        handleTaskPageCheckboxChange({
                          target: {
                            value: "canAddSaleFeedback",
                            checked: !SaleFeedbackPermission.canAddSaleFeedback,
                          },
                        });
                      }}
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`d-flex justify-content-center mt-4`}>
                <button
                  className={`btn ${styles.btnAdd}`}
                  onClick={handlePopUpOpen}
                >
                  + Add State Permission
                </button>
              </div>

              {activePopUp && (
                <StatePermissionsPopUP
                  setActivePopUp={setActivePopUp}
                  activePopUp={activePopUp}
                />
              )}
            </>
          )}
          {activeTab === 15 && (
            <div className={`${styles.permissionRow}`}>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canAccessTicketRaisePage"
                  checked={TicketRaisePermission.canAccessTicketRaisePage}
                  onChange={handleTicketRaiseCheckboxChange}
                />
                Can Access Ticket Raise Page
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canAddTicket"
                  checked={TicketRaisePermission.canAddTicket}
                  onChange={handleTicketRaiseCheckboxChange}
                />
                Can Add Ticket Raise
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canEditTicket"
                  checked={TicketRaisePermission.canEditTicket}
                  onChange={handleTicketRaiseCheckboxChange}
                />
                Can Edit Ticket Raise
              </label>
              <label className={`${styles.permissionCard} `}>
                <input
                  type="checkbox"
                  value="canDeleteTicket"
                  checked={TicketRaisePermission.canDeleteTicket}
                  onChange={handleTicketRaiseCheckboxChange}
                />
                Can Delete Ticket Raise
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalTabsTwo;
