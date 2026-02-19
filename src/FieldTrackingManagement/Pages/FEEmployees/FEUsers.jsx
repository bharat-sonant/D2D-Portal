// import { useState, useMemo, useEffect } from 'react';
// import style from './FEUsers.module.css';
// import { Plus, MapPin, Search, Users, ShieldCheck, MapPinned, Power, PowerOff, UserMinus, ChevronDown } from 'lucide-react';
// import AddFEAppUserModal from '../../Components/FEUsers/AddFEAppUserModal/AddFEAppUserModal';
// import AssignSiteModal from '../../Components/FEUsers/AssignSiteModal/AssignSiteModal';
// import * as action from '../../Actions/FEUsers/FEUsers_Action';
// import WevoisLoader from '../../../components/Common/Loader/WevoisLoader';
// import GlobalAlertModal from '../../../components/GlobalAlertModal/GlobalAlertModal';
//
// const FEUsers = () => {
//   const [userList, setUserList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [availableSites, setAvailableSites] = useState([]);
//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [selectedUserForSite, setSelectedUserForSite] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('Active');
//   const [siteFilter, setSiteFilter] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     show: false,
//     type: 'warning', // 'warning' for Deactivate, 'success' for Activate
//     user: null
//   });
//
// useEffect(() => {
//     const initializeData = async () => {
//         setIsLoading(true);
//         // Step 1: Pehle sites fetch karo aur result lo
//         const sites = await action.getAllowedSites(setAvailableSites); 
//         
//         // Step 2: Sites chahe empty ho ya nahi, list fetch karo
//         // ManagerId and CreatedBy logic backend handle kar lega
//         await action.getFEUsersList(setUserList, setIsLoading, sites);
//     };
//
//     initializeData();
// }, []);
//
//   const handleAddUserSuccess = (newUser) => {
//     setUserList(prev => [newUser, ...prev]);
//   };
//
//   const handleOpenAssignModal = (user) => {
//     setSelectedUserForSite(user);
//     setIsAssignModalOpen(true);
//   };
//
//   // 
 New API Integrated Toggle Logic
//   const handleToggleStatus = (empCode, currentStatus) => {
//     // Action call jo backend API hit karega aur local state (setUserList) ko update karega
//     action.updateFEUserStatus(empCode, currentStatus, setUserList);
//   };
//   // Jab User Toggle Button par click karega
//   const handleToggleClick = (user) => {
//     const isCurrentlyActive = user.status === 'Active';
//
//     setAlertConfig({
//       show: true,
      type: isCurrentlyActive ? 'warning' : 'success',
      user: user
    });
  };
  const confirmToggleStatus = () => {
    const { user } = alertConfig;
    if (user) {
      action.updateFEUserStatus(user.code, user.status, setUserList);
    }
    setAlertConfig({ ...alertConfig, show: false });
  };

const uniqueSitesFromList = useMemo(() => {
  if (!userList || userList.length === 0) return [];

  // 1. Saari assigned sites nikal lo
  const assignedSites = userList
    .map(user => user.site)
    .filter(site => site && site !== 'No site assigned');
  
  const uniqueAssigned = [...new Set(assignedSites)].sort();

  // 2. Check karo kya list mein koi unassigned user hai
  const hasUnassignedUsers = userList.some(user => 
    !user.site || user.site === 'No site assigned'
  );

  // 3. Agar unassigned users hain, toh "No site assigned" ko array mein add kar do
  if (hasUnassignedUsers) {
    uniqueAssigned.push("No site assigned");
  }

  return uniqueAssigned;
}, [userList]);

  const filteredUsers = useMemo(() => {
    if (!userList) return [];
    const result = userList.filter(user => {
      const name = user.name || '';
      const code = String(user.code || '');
      const site = user.site || 'No site assigned';

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || code.includes(searchTerm);
      const matchesStatus = statusFilter === '' || user.status === statusFilter;
      const matchesSite = siteFilter === '' || site.toLowerCase() === siteFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSite;
    });
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [userList, searchTerm, statusFilter, siteFilter]);

  return (
    <>
      {isLoading ? (
        <WevoisLoader title="Loading users..." height="calc(100vh - 64px)" />
      ) : (
        <div className={style.container}>
          <div className={style.stickyTopSection}>
            <div className={style.header}>
              <div className={style.titleSection}>
                <h1>Field Executives</h1>
                <p>Manage app access and site assignments for executives</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className={style.summaryWrapper}>
              <div className={style.statCard}>
                <Users size={22} className={style.iconBlue} />
                <div className={style.statInfo}>
                  <span className={style.statValue}>{userList.length}</span>
                  <label className={style.statLabel}>Total Users</label>
                </div>
              </div>
              <div className={style.statCard}>
                <ShieldCheck size={22} className={style.iconGreen} />
                <div className={style.statInfo}>
                  <span className={style.statValue}>{userList.filter(u => u.status === 'Active').length}</span>
                  <label className={style.statLabel}>Active Users</label>
                </div>
              </div>
              <div className={style.statCard}>
                <UserMinus size={22} className={style.iconRed} />
                <div className={style.statInfo}>
                  <span className={style.statValue}>{userList.filter(u => u.status === 'InActive').length}</span>
                  <label className={style.statLabel}>Inactive Users</label>
                </div>
              </div>
              <div className={style.statCard}>
                <MapPinned size={22} className={style.iconOrange} />
                <div className={style.statInfo}>
                  <span className={style.statValue}>{userList.filter(u => u.site && u.site !== 'No site assigned').length}</span>
                  <label className={style.statLabel}>Site Assigned</label>
                </div>
              </div>
            </div>

            <div className={style.tableControls}>
              <div className={style.leftGroup}>
                <div className={style.selectWrapper}>
                  <select className={style.customSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All status</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </select>
                  <ChevronDown size={14} className={style.selectIcon} />
                </div>

             <div className={style.selectWrapper}>
  <select 
    className={style.customSelect} 
    value={siteFilter} 
    onChange={(e) => setSiteFilter(e.target.value)}
  >
    <option value="">All Sites</option>
    {uniqueSitesFromList.map((siteName, index) => (
      <option key={index} value={siteName}>
        {siteName === 'No site assigned' ? 'Unassigned' : siteName}
      </option>
    ))}
  </select>
  <ChevronDown size={14} className={style.selectIcon} />
</div>
              </div>

              <div className={style.rightGroup}>
                <div className={style.searchWrapper}>
                  <Search size={16} className={style.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search employee by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={style.tableContainer}>
            <div className={style.tableScrollArea}>
              <table className={style.userTable}>
                <thead>
                  <tr>
                    <th>Emp Code</th>
                    <th>Employee Name</th>
                    <th>Assigned Site</th>
                    <th>Last Login</th>
                    <th>Status</th>
                    <th className={style.textCenter}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td><span className={style.codeBadge}>{user.code}</span></td>
                        <td>
                          <div className={style.nameText}>{user.name}</div>
                          <div className={style.emailText}>{user.email}</div>
                        </td>
                        <td>
                          <span className={(!user.site || user.site === 'No site assigned') ? style.sitePending : style.siteBadge}>
                            {user.site || 'No site assigned'}
                          </span>
                        </td>
                        <td className={style.dimText}>{user.lastLogin || 'N/A'}</td>
                        <td>
                          <span className={user.status === 'Active' ? style.statusActive : style.statusInactive}>
                            {user.status}
                          </span>
                        </td>
                        <td className={style.actionsCell}>
                          <div className={style.actionButtonsGroup}>
                            {/* ✅ Updated Toggle Button */}
                            <button
                              onClick={() => handleToggleClick(user)} // Direct calling instead of previous toggle
                              className={`${style.actionBtn} ${user.status === 'Active' ? style.btnDeactivate : style.btnActivate}`}
                            >
                              {user.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                            </button>

                            <button
                              className={style.actionBtn}
                              title="Assign Site"
                              onClick={() => handleOpenAssignModal(user)}
                            >
                              <MapPin size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <button className={style.fab} onClick={() => setIsModalOpen(true)}>
            <Plus size={28} />
          </button>

          <AddFEAppUserModal
            showCanvas={isModalOpen}
            setShowCanvas={() => setIsModalOpen(false)}
            onSuccess={handleAddUserSuccess}
            availableSites={availableSites}
          />
          <GlobalAlertModal
            show={alertConfig.show}
            iconType={alertConfig.type}
            title={alertConfig.type === 'success' ? 'Activate Executive' : 'Deactivate Executive'}
            message={
              <span>
                Are you sure you want to {alertConfig.type === 'success' ? 'enable' : 'disable'} access for{' '}
                <strong style={{ textTransform: 'capitalize', color: 'inherit' }}>
                  {alertConfig.user?.name?.toLowerCase()}
                </strong>?
              </span>
            }
            userName={alertConfig.user?.name}
            warningText="Deactivating will immediately revoke the executive's access to the mobile application and sync services."
            successText="Activating will restore the executive's ability to log in and perform field operations."
            buttonText={alertConfig.type === 'success' ? 'Confirm Activation' : 'Confirm Deactivation'}
            onCancel={() => setAlertConfig({ ...alertConfig, show: false })}
            onConfirm={confirmToggleStatus}
          />
          {isAssignModalOpen && (
            <AssignSiteModal
              user={selectedUserForSite}
              availableSites={availableSites}
              onClose={() => setIsAssignModalOpen(false)}
              // FEUsers.jsx mein AssignSiteModal ka onAssign prop
              onAssign={(empCode, siteObj) => {
                const dto = {
                  employeeCode: empCode,
                  siteId: siteObj.siteId,        // Backend requirement
                  assignedBy: localStorage.getItem('userId') || "N/A",   // Current logged-in user context se le sakte hain
                  siteName: siteObj.siteName
                };
      
                action.assignSiteToUser(dto, setUserList);
                setIsAssignModalOpen(false); // Modal band karne ke liye
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default FEUsers;