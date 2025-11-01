import React, { useEffect, useState } from "react";
import EmployeementDetailsStyle from "../../Style/Profile/Employeementdetail.module.css";
import styles from "../../assets/css/Employee/EmployementDetails.module.css";
import { images } from "../../assets/css/imagePath";
import dayjs from "dayjs";
import { getEmployeementDetailsData } from "../../actions/Profile/ProfileAction";
import { FaRegEdit } from "react-icons/fa";
import UpdateEmployeementDetails from "./UpdateEmployeementDetails";
const EmploymentData = (props) => {
  const [branchData, setBranchData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  // State for open Update Employeement Details
  const [openUpdateEmployeeCanvas, setOpenUpdateEmployeeCanvas] =
    useState(false);

  useEffect(() => {
    // console.log(props.employeementDetailsData)
    if (props.loggedInUserId && props.Company) {
      getEmployeementDetailsData(
        props.Company,
        props.loggedInUserId,
        props.setEmployeementDetailsData
      );
    }
  }, [props.loggedInUserId, props.Company, props.renderList]);

  const handleEditEmployeementdetail = () => {
    setOpenUpdateEmployeeCanvas(true);
  };

  return (
    <>
      <div className={`${styles.defaultHeader}`}>
        <div className={`${styles.defaultHeaderLeft}`}>Employement Details</div>
        <div className={`${styles.defaultHeaderRight}`}>
          <img
            src={images.iconEdit}
            className={`img-fluid ${styles.iconEdit}`}
            title="Edit"
            alt="icon"
          />
        </div>
      </div>
      <div className={`${styles.defaultBG}`}>
        <div className={`${styles.pageRow}`}>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconLocation}
                className={`img-fluid ${styles.iconDefault}`}
                title="Branch"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Branch</div>
              <div className={`${styles.userDesignation}`}>{props.employeementDetailsData?.branch || "N/A"}</div>
            </div>
          </div>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconDepartment}
                className={`img-fluid ${styles.iconDefault}`}
                title="Department"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Department</div>
              <div className={`${styles.userDesignation}`}>{props.employeementDetailsData?.department || "N/A"}</div>
            </div>
          </div>
        </div>
        <div className={`${styles.pageRow}`}>
          <div className={`${styles.infoRow}`}>
            <div className={`${styles.infoLeft}`}>
              <img
                src={images.iconDepartment}
                className={`img-fluid ${styles.iconDefault}`}
                title="Date of Joining"
                alt="Icon"
              />
            </div>

            <div className={`${styles.infoRight}`}>
              <div className={`${styles.userName}`}>Date of Joining</div>
              <div className={`${styles.userDesignation}`}> {props.employeementDetailsData?.dateOfJoining
              ? dayjs(props.employeementDetailsData.dateOfJoining).isValid()
                ? dayjs(props.employeementDetailsData.dateOfJoining).format(
                    "DD MMM YYYY"
                  )
                : "N/A"
              : "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className={EmployeementDetailsStyle.container}>
        <h5 className={EmployeementDetailsStyle.header}>Employment Details</h5>

        <div className={EmployeementDetailsStyle.Details}>
          <div className={EmployeementDetailsStyle.detailItem}>
            <strong>Branch Name:</strong>
            <span>{props.employeementDetailsData?.branch || "N/A"}</span>
          </div>
          <div className={EmployeementDetailsStyle.detailItem}>
            <strong>Department:</strong>
            <span>{props.employeementDetailsData?.department || "N/A"}</span>
          </div>
          <div className={EmployeementDetailsStyle.detailItem}>
            <strong>Designation:</strong>
            <span>{props.employeementDetailsData?.designation || "N/A"}</span>
          </div>
          <div className={EmployeementDetailsStyle.detailItem}>
            <strong>Date of Joining:</strong>
            {props.employeementDetailsData?.dateOfJoining
              ? dayjs(props.employeementDetailsData.dateOfJoining).isValid()
                ? dayjs(props.employeementDetailsData.dateOfJoining).format(
                    "DD MMM YYYY"
                  )
                : "N/A"
              : "N/A"}
          </div>
        </div>
      </div> */}
      {openUpdateEmployeeCanvas && (
        <UpdateEmployeementDetails
          show={openUpdateEmployeeCanvas}
          setShow={setOpenUpdateEmployeeCanvas}
          Company={props.Company}
          initialData={props.employeementDetailsData}
          branchData={branchData}
          setBranchData={setBranchData}
          departmentData={departmentData}
          setDepartmentData={setDepartmentData}
          designationData={designationData}
          setDesignationData={setDesignationData}
          EmpCode={props.loggedInUserId}
          renderList={props.renderList}
          setRenderList={props.setRenderList}
        />
      )}
    </>
  );
};

export default EmploymentData;
