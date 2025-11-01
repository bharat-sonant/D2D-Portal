import { useState } from "react";
import styles from "../../assets/css/Employee/EmployeeData.module.css";
import EmployeementDetails from "./EmployeementDetails";
import PersonalDetails from "./PersonalDetails";
import ManageManager from "./ManageManager";

const EmployeeData = (props) => {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div className={styles.verticalTabsContainer} >
            <div className={styles.tabs}>
                <div className={styles.tabHeader}>Employee Data</div>
                <div
                    className={`${styles.tab} ${activeTab === 1 ? styles.active : ""}`}
                    onClick={() => handleTabClick(1)}
                >
                Employment Details
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 2 ? styles.active : ""}`}
                    onClick={() => handleTabClick(2)}
                >
                    Personal Details
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 3 ? styles.active : ""}`}
                    onClick={() => handleTabClick(3)}
                >
                    Manage Permission
                </div>
            </div>
            <div className={styles.tabContent}>
                {activeTab === 1 && <div>
                    <EmployeementDetails
                        EmpCode={props.peopleEmpCode}
                        setEmployeementDetails={props.setEmployeementDetails}
                        employeementDetails={props.employeementDetails}
                        filteredUsers={props.filteredUsers}
                        setRenderList={props.setRenderList}
                    />
                </div>
                }
                {activeTab === 2 && <div>
                    <PersonalDetails
                        selectedPeopledata={props.selectedPeopledata}
                        setSelectedPeopleData={props.setSelectedPeopleData}
                        peopleEmpCode={props.peopleEmpCode}
                        setIsEdit={props.setIsEdit}
                        setShowCanvas={props.setShowCanvas}
                        triggerList={props.triggerList}
                        name={props.name}
                        setName={props.setName}
                        isEdit={props.isEdit}
                        setTriggerList={props.setTriggerList}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        empStatus={props.empStatus}
                        setEmpStatus={props.setEmpStatus}
                        filteredUsers={props.filteredUsers}
                    />
                </div>}
                {activeTab === 3 && <div>
                    <ManageManager
                        selectedPeopledata={props.selectedPeopledata}
                        setSelectedPeopleData={props.setSelectedPeopleData}
                        peopleEmpCode={props.peopleEmpCode}
                        setIsEdit={props.setIsEdit}
                        setShowCanvas={props.setShowCanvas}
                        triggerList={props.triggerList}
                        name={props.name}
                        setName={props.setName}
                        isEdit={props.isEdit}
                        setTriggerList={props.setTriggerList}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        empStatus={props.empStatus}
                        setEmpStatus={props.setEmpStatus}
                        allPeopleData={props.allPeopleData}
                        setAllPeopleData={props.setAllPeopleData}
                        PeopleData={props.PeopleData}
                        setPeopleData={props.setPeopleData}
                        setFilteredUsers={props.setFilteredUsers}
                    />
                </div>}
            </div>
        </div>
    );
};

export default EmployeeData;
