import { useState } from "react";
import dayjs from "dayjs";
import UpdateEmployeementDetails from "./UpdateEmployeementDetails";
import styles from "../../assets/css/Employee/EmployementDetails.module.css";
import { images } from "../../assets/css/imagePath";

const EmployeementDetails = (props) => {
  const [openAddEmployeementWindow, setOpenAddEmployeementWindow] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const Company = localStorage.getItem("company");


  const handleOpenWindow = () => {
    if (Array.isArray(props.filteredUsers)) {
      if (props.filteredUsers.length !== 0) {
        setOpenAddEmployeementWindow(true);
      }
    }
  };
  return (
    <>
      <div className={`${styles.defaultBG}`}>
        <div className={`${styles.defaultHeader}`}>
          <div className={`${styles.defaultHeaderLeft}`}>
            Employment Detail
          </div>
          <div className={`${styles.defaultHeaderRight}`}>
            <img
              src={images.iconEdit}
              className={`img-fluid ${styles.iconEdit}`}
              title="Edit"
              alt="icon"
              onClick={handleOpenWindow}
            />
          </div>
        </div>
        <div className={`${styles.commonBody}`}>
          <ul className={`${styles.commonBodyUL}`}>
            <li className={`${styles.commonBodyLi}`} title="Branch">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconLocation}`}
                  className={`${styles.iconDefault}`}
                  title="Branch"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.employeementDetails.branch || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Department">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconDepartment}`}
                  className={`${styles.iconDefault}`}
                  title="Department"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.employeementDetails.department || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Designation">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconDesignation}`}
                  className={`${styles.iconDefault}`}
                  title="Designation"
                  alt="icon"
                />
              </div>


              <div className={`${styles.detailsRight}`}>
                {props.employeementDetails.designation || "N/A"}
              </div>
            </li>
            <li className={`${styles.commonBodyLi}`} title="Date of Joining">
              <div className={`${styles.detailsLeft}`}>
                <img
                  src={`${images.iconCalendar}`}
                  className={`${styles.iconDefault}`}
                  title="Date of Joining"
                  alt="icon"
                />
              </div>

              <div className={`${styles.detailsRight}`}>
                {props.employeementDetails.dateOfJoining
                  ? dayjs(props.employeementDetails.dateOfJoining).isValid()
                    ? dayjs(props.employeementDetails.dateOfJoining).format(
                      "DD MMM YYYY"
                    )
                    : "N/A"
                  : "N/A"}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {openAddEmployeementWindow && (
        <UpdateEmployeementDetails
          show={openAddEmployeementWindow}
          setShow={setOpenAddEmployeementWindow}
          Company={Company}
          setBranchData={setBranchData}
          branchData={branchData}
          setDepartmentData={setDepartmentData}
          departmentData={departmentData}
          setDesignationData={setDesignationData}
          designationData={designationData}
          EmpCode={props.EmpCode}
          setRenderList={props.setRenderList}
          initialData={props.employeementDetails}
        />
      )}
    </>
  );
};

export default EmployeementDetails;
