import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import UserList from "../../components/Users/UserList";
import AddUser from "../../components/Users/AddUser";
import * as userAction from '../../Actions/UserAction/UserAction';
import UserStatusDialog from "../../components/Users/AlertPopUp";
import UserCityAccess from "../../components/Users/UserCityAccess";
import Calendar from "../../components/Users/calendar";

const User = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [confirmUser, setConfirmUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [activeInactiveUserList, setActiveInactiveUserList] = useState([]);

  const loadUsers = async () => {
    await userAction.fetchUserData(setSelectedUser, setUsers, setLoading, setActiveInactiveUserList);
  };

  const loadCities = async () => {
    await userAction.loadCityData(setCityList);
  }

  useEffect(() => {
    loadUsers();
    loadCities();
  }, []);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };

  const openConfirm = () => {
    setConfirmUser(true);
  };

  const handleStatusToggle = async (user) => {
    userAction.updateStatus(user, setUsers, setActiveInactiveUserList, setSelectedUser, setConfirmUser);
  };

  const handleEditUser = () => {
    setOnEdit(true);
    setShowCanvas(true);
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        <button
          className={`${GlobalStyles.floatingBtn}`}
          onClick={handleOpenModal}
        >
          +
        </button>
      </div>

      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
          <UserList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            loading={loading}
            activeInactiveUserList={activeInactiveUserList}
            setUsers={setUsers}
          />
        </div>

        <div className={TaskStyles.employeeRight} style={{ marginLeft: '110px' }}>
          <div
            style={{
              width: "25%",
              background: "#fff",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* LEFT */}
            <span
              style={{
                background: "#f2f2f2",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {selectedUser?.name || "N/A"}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                onClick={() => openConfirm()}
                style={{
                  width: "42px",
                  height: "22px",
                  borderRadius: "22px",
                  background:
                    selectedUser?.status === "active" ? "#4caf50" : "#f8d7da",
                  position: "relative",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    background: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                    left: selectedUser?.status === "active" ? "22px" : "2px",
                    transition: "0.3s",
                  }}
                />
              </div>
              <span
                onClick={handleEditUser}
                title="Edit"
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "6px",
                  borderRadius: "50%",
                  border: "1px solid #ddd",
                }}
              >
                ✏️
              </span>
            </div>
          </div>
          <UserCityAccess
            cityList={cityList}
            selectedUser={selectedUser}
          />
          <div style={{width:'400px'}}>
     {selectedUser!==null&&(
  <Calendar selectedUser={selectedUser}/>
         )

         }
          </div>
    
        
        </div>
      </div>

      <div className={GlobalStyles.mainSections}>
        <AddUser
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          loadUsers={loadUsers}
          editData={selectedUser}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        />
      </div>

      {confirmUser && (
        <UserStatusDialog
          name={selectedUser.name}
          setConfirmUser={setConfirmUser}
          handleStatusToggle={handleStatusToggle}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
};

export default User;
