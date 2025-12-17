import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import { fetchUsers, updateUserStatus } from "../../services/supabaseServices";
import CityList from "../../components/City/CityList";
import AddCity from "../../components/City/AddCity";

const City = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [onEdit,setOnEdit]=useState(false)
   const [confirmUser, setConfirmUser] = useState(null);

 const loadCities = async () => {
  const data = await fetchUsers('Cities');
  const sortedData = [...data].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  setSelectedUser(sortedData[0])
  setUsers(sortedData);
};


  useEffect(() => {
    loadCities();
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
          <CityList users={users} selectedUser={selectedUser}  setSelectedUser={setSelectedUser}/>
        </div>

      </div>
      <div className={GlobalStyles.mainSections}>
        <AddCity showCanvas={showCanvas} setShowCanvas={setShowCanvas} loadCities={loadCities} editData ={selectedUser} onEdit={onEdit} setOnEdit={setOnEdit}/>
      </div>
    </>
  );
};

export default City;
