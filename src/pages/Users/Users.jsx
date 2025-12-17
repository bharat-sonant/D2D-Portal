import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import styles from "../../MobileAppPages/Tasks/Styles/TaskDetails/TaskDetails.module.css";
import UserList from "../../components/Users/UserList";
import AddUser from "../../components/Users/AddUser";
import { fetchUsers, updateUserStatus } from "../../services/supabaseServices";

const User = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [onEdit,setOnEdit]=useState(false)
   const [confirmUser, setConfirmUser] = useState(null);

 const loadUsers = async () => {
  const data = await fetchUsers('users');
  const sortedData = [...data].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  setSelectedUser(sortedData[0])
  setUsers(sortedData);
};


  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };

//   const handleToggleStatus = () => {
//   setSelectedUser((prev) => ({
//     ...prev,
//     isActive: !prev.isActive,
//   }));
// };
const openConfirm = () => {
  
  setConfirmUser(true);
};
const handleStatusToggle = async (user) => {
  const updatedStatus = await updateUserStatus(user.id, user.status);
  setUsers((prev) =>
    prev.map((u) =>
      u.id === user.id ? { ...u, status: updatedStatus } : u
    )
  );
   setSelectedUser({
    ...user,
    status: updatedStatus
  });
  setConfirmUser(false);
};


const handleEditUser = () => {
 setOnEdit(true)
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
          <UserList users={users} selectedUser={selectedUser}  setSelectedUser={setSelectedUser}/>
        </div>
<div className={TaskStyles.employeeRight}>
  <div
  style={{
    width: '25%',
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
    {selectedUser?.username || "N/A"}
  </span>

  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
    <div
      onClick={() => openConfirm()}
      style={{
        width: "42px",
        height: "22px",
        borderRadius: "22px",
        background: selectedUser?.status === 'active' ? '#4caf50' : '#f8d7da',
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
          left: selectedUser?.status === 'active' ? '22px' : '2px',
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

</div>

      </div>
      <div className={GlobalStyles.mainSections}>
        <AddUser showCanvas={showCanvas} setShowCanvas={setShowCanvas} loadUsers={loadUsers} editData ={selectedUser} onEdit={onEdit} setOnEdit={setOnEdit}/>
      </div>

 {confirmUser && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <div
      style={{
        background: '#fff',
        width: '520px',
        minHeight: '240px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      
      {/* TEXT AREA */}
      <p style={{ fontSize: '16px', lineHeight: '20px', marginTop: '60px' }}>
        Are you sure you want to{' '}
        <b>
          {selectedUser.status === 'active' ? 'deactivate' : 'activate'}
        </b>{' '}
        <b>{selectedUser.name}</b>?
      </p>

      {/* BUTTONS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px'
        }}
      >
        <button
          onClick={() => setConfirmUser(null)}
          style={{
            padding: '10px 18px',
            background: '#e0e0e0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>

        <button
          onClick={() => handleStatusToggle(selectedUser)}
          style={{
            padding: '10px 18px',
            background:
              selectedUser.status === 'active' ? '#d32f2f' : '#2e7d32',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}




    </>
  );
};

export default User;
