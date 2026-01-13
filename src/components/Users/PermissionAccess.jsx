import { useEffect, useState } from "react";
import styles from "../../assets/css/User/PermissionAccess.module.css";
import * as action from "../../Actions/UserAction/PermissionAction";
import dayjs from 'dayjs';

const PermissonAccess = (props) => {
  const pages = [
    { pageName: "User",pageNumber:1,Module: ["Can Access User Page","Can Add User","Can Give Permissions"]},
  ];
  const [activeTab, setActiveTab] = useState(1);
  const [ModuleList, setModuleList] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(()=>{
    if(props.selectedUser!==undefined){
         const activePage = pages.find((page) => page.pageNumber === activeTab);
    setModuleList(activePage.Module);
  action.getUserPagesPermissionsAction(props.selectedUser.id,setPermissions)
    }

  },[props.selectedUser])


  const handleTabClick = (tabIndex) => {
    const activePage = pages.find((page) => page.pageNumber === tabIndex);
    setModuleList(activePage.Module);
    setActiveTab(tabIndex);
    
  };

  const handleAttendanceCheckboxChange = ({ target }) => {
  const { value, checked } = target;
  setPermissions((prev) => ({
    ...prev,
    [value.replace(/\s+/g, "")]: checked,
  }));
   let permissionDetail ={
     user_id:props.selectedUser.id,
     access_page:value.replace(/\s+/g, ""),
     access_control:checked,
    created_by: localStorage.getItem('name'),
    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
   }
    action.savePagesPermnissionAction(permissionDetail)
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
          {pages.map((page) => (
            <div
              key={page.pageNumber}
              className={`${styles.tab} ${
                activeTab === page.pageNumber ? styles.active : ""
              }`}
              onClick={() => handleTabClick(page.pageNumber)}
            >
              {page.pageName}
            </div>
          ))}
        </div>
        <div className={`${styles.tabContent} ${styles.tabContentTwo}`}>
          {ModuleList && (
            <div className={styles.permissionRow}>
              {ModuleList.map((moduleName, index) => (
                <div
                  key={index}
                  className={`${styles.toggleRow} ${styles.permissionCard}`}
                >
                  <div className={styles.toggleLeft}>
                    <div className={styles.toggleText}>{moduleName}</div>
                  </div>

                  <div className={styles.toggleRight}>
                    <div
                      className={`${styles.toggle} ${
                        permissions[moduleName.replace(/\s+/g, "")]
                          ? styles.on
                          : styles.off
                      }`}
                      onClick={() =>
                        handleAttendanceCheckboxChange({
                          target: {
                            value: moduleName,
                            checked: !permissions[moduleName.replace(/\s+/g, "")],
                          },
                        })
                      }
                    >
                      <div className={styles.toggleCircle}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissonAccess;
