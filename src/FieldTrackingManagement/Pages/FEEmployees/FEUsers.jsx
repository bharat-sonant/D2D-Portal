import { useState, useMemo } from 'react';
import style from './FEUsers.module.css';
import { Plus, MapPin, Send, Search, Users, ShieldCheck, MapPinned, Power, PowerOff, UserMinus, ChevronDown } from 'lucide-react';
import AddFEAppUserModal from '../../Components/FEUsers/AddFEAppUserModal/AddFEAppUserModal';


const FEUsers = () => {
  const [userList, setUserList] = useState([
    { id: 1, code: '10002', name: 'KESHAV', email: 'KESHAV@GMAIL.COM', username: 'KESHAV10002', lastLogin: '24 Jan 2026', site: 'Chandpole', status: 'Active' },
    { id: 2, code: '1002', name: 'Khushwant Sharma', email: 'N/A', username: 'KHUSH1002', lastLogin: 'Not Logged In', site: 'No site assigned', status: 'Inactive' },
    { id: 3, code: '909', name: 'KISHAN', email: 'KISHAN@GMAIL.COM', username: 'KISHAN909', lastLogin: '22 Jan 2026', site: 'Chandpole', status: 'Active' },
    { id: 4, code: '1020', name: 'Nishant', email: 'nishant@gmail.com', username: 'NISH1020', lastLogin: '23 Jan 2026', site: 'Pali', status: 'Active' },
    { id: 5, code: '1021', name: 'Amit Kumar', email: 'amit@gmail.com', username: 'AMIT1021', lastLogin: '20 Jan 2026', site: 'Chandpole', status: 'Active' },
    { id: 6, code: '1022', name: 'Rahul Singh', email: 'rahul@gmail.com', username: 'RAHUL1022', lastLogin: 'Not Logged In', site: 'No site assigned', status: 'Inactive' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [siteFilter, setSiteFilter] = useState('');
  
  // Modal visibility handle karne ke liye state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (id) => {
    setUserList(prevList =>
      prevList.map(user =>
        user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    return userList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.code.includes(searchTerm);
      const matchesStatus = statusFilter === '' || user.status === statusFilter;
      const matchesSite = siteFilter === '' || user.site.toLowerCase() === siteFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesSite;
    });
  }, [userList, searchTerm, statusFilter, siteFilter]);

  return (
    <div className={style.container}>
      <div className={style.stickyTopSection}>
        <div className={style.header}>
          <div className={style.titleSection}>
            <h1>Field Executive Users</h1>
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
              <span className={style.statValue}>{userList.filter(u => u.status === 'Inactive').length}</span>
              <label className={style.statLabel}>Inactive Users</label>
            </div>
          </div>
          <div className={style.statCard}>
            <MapPinned size={22} className={style.iconOrange} />
            <div className={style.statInfo}>
              <span className={style.statValue}>{userList.filter(u => u.site !== 'No site assigned').length}</span>
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
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={14} className={style.selectIcon} />
            </div>

            <div className={style.selectWrapper}>
              <select className={style.customSelect} value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
                <option value="">All Sites</option>
                <option value="Chandpole">Chandpole</option>
                <option value="Pali">Pali</option>
                <option value="No site assigned">Unassigned</option>
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
                <th>Code</th>
                <th>Employee Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Last Login</th>
                <th>Assigned Site</th>
                <th>Status</th>
                <th className={style.textCenter}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><span className={style.codeBadge}>{user.code}</span></td>
                  <td>
                    <div className={style.nameText}>{user.name}</div>
                    <div className={style.emailText}>{user.email}</div>
                  </td>
                  <td className={style.dimText}>{user.username}</td>
                  <td className={style.passwordCell}>••••••</td>
                  <td className={style.dimText}>{user.lastLogin}</td>
                  <td>
                    <span className={user.site === 'No site assigned' ? style.sitePending : style.siteBadge}>
                      {user.site}
                    </span>
                  </td>
                  <td>
                    <span className={user.status === 'Active' ? style.statusActive : style.statusInactive}>
                      {user.status}
                    </span>
                  </td>
                  <td className={style.actions}>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`${style.actionBtn} ${user.status === 'Active' ? style.btnDeactivate : style.btnActivate}`}
                    >
                      {user.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                    <button className={style.actionBtn} title="Assign Site"><MapPin size={16} /></button>
                    <button className={style.actionBtn} title="Resend Login Credentials"><Send size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fab Button par Click Event add kiya */}
      <button 
        className={style.fab} 
        title="Create New User"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={28} />
      </button>

      {/* Modal Component Yahan Rakha Hai */}
      <AddFEAppUserModal
        showCanvas={isModalOpen} 
        setShowCanvas={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default FEUsers;