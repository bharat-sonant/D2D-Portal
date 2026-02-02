import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import { Edit2 } from "lucide-react";

import styles from "./Users.module.css";
import UserList from "../../components/Users/UserList";
import AddUser from "../../components/Users/AddUser";
import * as userAction from "../../Actions/UserAction/UserAction";
import UserStatusDialog from "../../components/Users/AlertPopUp";
import UserCityAccess from "../../components/Users/UserCityAccess";
import Calendar from "../../components/Users/calendar";
import PermissonAccess from "../../components/Users/PermissionAccess";
import { usePermissions } from "../../context/PermissionContext";
import UserLoginHistory from "../../components/Users/UserLogInHistory";
import SiteAssignmentAlert from "../../components/Users/siteAlertPopup";
import GlobalOffcanvas from "../../components/Common/globalOffcanvas/globalOffcanvas";

const User = () => {
  const { permissionGranted } = usePermissions();
  const [showCanvas, setShowCanvas] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [confirmUser, setConfirmUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [activeInactiveUserList, setActiveInactiveUserList] = useState([]);
  const [assignedSiteList, SetAssignedSiteList] = useState(true);
  const [siteAlertPopup, setSiteAlertPopup] = useState(false);
  const loadUsers = async () => {
    await userAction.fetchUserData(
      setSelectedUser,
      setUsers,
      setLoading,
      setActiveInactiveUserList,
    );
  };

  const loadCities = async () => {
    await userAction.loadCityData(setCityList);
  };

  useEffect(() => {
    loadUsers();
    loadCities();
  }, []);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };

  const openConfirm = () => {
    setConfirmUser(true);
    setShowModal(true);
  };

  const handleStatusToggle = async (user) => {
    userAction.updateStatus(
      user,
      setUsers,
      setActiveInactiveUserList,
      setSelectedUser,
      setConfirmUser,
    );
  };

  const handleEditUser = () => {
    setOnEdit(true);
    setShowCanvas(true);
  };

  const getInitials = (name = "") => {
    if (!name) return "";

    const words = name
      .trim()
      .split(/\s+/) // multiple spaces safe
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    // 🔥 sirf first 2 words ke initials
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <>
      {!isHistoryOpen && permissionGranted?.CanAddUser === true && (
        <div className={GlobalStyles.floatingDiv}>
          <button
            className={GlobalStyles.floatingBtn}
            onClick={handleOpenModal}
          >
            +
          </button>
        </div>
      )}

      <div className={`${styles.userPage}`}>
        {/* Background */}
        <div className={styles.background}>
          <div className={`${styles.gradientOrb} ${styles.orb1}`} />
          <div className={`${styles.gradientOrb} ${styles.orb2}`} />
          <div className={`${styles.gradientOrb} ${styles.orb3}`} />
          <div className={styles.gridOverlay} />
        </div>

        {/* Particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className={`${styles.userPageLeft}`}>
          <UserList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            loading={loading}
            activeInactiveUserList={activeInactiveUserList}
            setUsers={setUsers}
          />
        </div>

        <div className={styles.userPageRight}>
          <div className={styles.userStatusCard}>
            {/* LEFT */}
            <div className={styles.userLeft}>
              <div className={styles.avatar}>
                {getInitials(selectedUser?.name)}
              </div>
              <span className={styles.userName}>
                {selectedUser?.name || "N/A"}
                <p>Manage users, permissions, site access and more</p>
              </span>
            </div>
            {/* RIGHT */}
            <div className={styles.actionWrapper}>
              {/* STATUS TOGGLE */}
              <div
                className={`${styles.activeInactiveBadge} ${
                  selectedUser?.status === "active"
                    ? styles.badgeActive
                    : styles.badgeInactive
                }`}
                onClick={openConfirm}
              >
                {selectedUser?.status === "active" ? "Deactivate" : "Activate"}
              </div>

              {/* EDIT */}
              {permissionGranted?.CanAddUser === true && (
                <span
                  className={styles.editIcon}
                  onClick={handleEditUser}
                  title="Edit"
                >
                  <Edit2 size={14} />
                </span>
              )}
            </div>
          </div>

          <div className={styles.userInnerRight}>
            <UserCityAccess
              cityList={cityList}
              selectedUser={selectedUser}
              SetAssignedSiteList={SetAssignedSiteList}
            />
            <div className={``} style={{ display: "flex", flexFlow: "column" }}>
              {selectedUser !== null && (
                <Calendar
                  selectedUser={selectedUser}
                  onHistoryToggle={setIsHistoryOpen}
                />
              )}
              {selectedUser !== null &&
                permissionGranted?.CanGivePermissions === true && (
                  <PermissonAccess
                    selectedUser={selectedUser}
                    assignedSiteList={assignedSiteList}
                    setSiteAlertPopup={setSiteAlertPopup}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <AddUser
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
        loadUsers={loadUsers}
        editData={selectedUser}
        onEdit={onEdit}
        setOnEdit={setOnEdit}
      />

      {confirmUser && (
        <UserStatusDialog
          showModal={showModal}
          setShowModal={setShowModal}
          name={selectedUser.name}
          confirmUser={confirmUser}
          setConfirmUser={setConfirmUser}
          handleStatusToggle={handleStatusToggle}
          selectedUser={selectedUser}
        />
      )}
      {siteAlertPopup && (
        <SiteAssignmentAlert setSiteAlertPopup={setSiteAlertPopup} />
      )}
      {/* <UserLoginHistory
        userId={selectedUser?.id}
        userName={selectedUser?.name}
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      /> */}
      <GlobalOffcanvas
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title={selectedUser?.name || "Login History"}
        width="375px"
      >
        <UserLoginHistory
          userId={selectedUser?.id}
          userName={selectedUser?.name}
        />
      </GlobalOffcanvas>
    </>
  );
};

export default User;
