// import { useState,useMemo, useEffect } from "react";
// import styles from "./FEAssignments.module.css";
// import {Search,Plus,Eye} from "lucide-react";
// import AssignTask from "../../Components/FEAssignments/AssignTask/AssignTask";
// import WevoisLoader from "../../../components/Common/Loader/WevoisLoader";
// import { getuserSites } from "../../Actions/FEAssignTasks/FEAssignTasks";
//
// const users = [
//   {name:'Anil Sharma',code:'EMP002',contact:'8954842222',site:'Sikar',status:'In Progress',estimatedTime:'1 Hour',tasks:3,estimatedTime:'1 Hour',site:'Sikar'},
//   {name:'Prashant Meena',code:'EMP001',contact:'9876543210',site:'Jaipur',status:'In Progress',estimatedTime:'2 Hours',tasks:5,estimatedTime:'2 Hours',site:'Jaipur'},
// ];
//
// const FEAssignments = () => {
//     const userId = localStorage.getItem('userId');
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [sites, setSites] = useState([]);
//     const [sitesLoading, setSitesLoading] = useState(true);
//     const [sitesError, setSitesError] = useState(null);
//     const [selectedSite, setSelectedSite] = useState("");
//     const [assignTaskWindow,setAssignTaskWindow]=useState({status:false,data:null});
//     const filteredUsers = useMemo(() => {
//       return users.filter((user) => {
//         const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                              user.code.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesSite = selectedSite === "" || user.site === selectedSite;
//         return matchesSearch && matchesSite;
//       });
//     }, [searchTerm, selectedSite]);
//
//     useEffect(() => { 
//       const timer = setTimeout(() => {
//         setLoading(false);
//       }, 1000); // Simulate a 1 second loading time
//       return () => clearTimeout(timer);
//     }, []);
//
//     useEffect(()=>{
//        getuserSites(userId, setSites, setSitesLoading)
//     },[])
//     
//     return (
//       <div className={`${styles.employeesContainer} mt-0`}>
//         <div className={styles.background}>
//           <div className={`${styles.gradientOrb} ${styles.orb1}`} />
//           <div className={`${styles.gradientOrb} ${styles.orb2}`} />
//           <div className={`${styles.gradientOrb} ${styles.orb3}`} />
//           <div className={styles.gridOverlay} />
//         </div>
//
//         <div className={styles.contentWrapper}>
//           <div className={styles.headerRow}>
//             <div>
//               <h2 className={styles.pageTitle}>Field Task Assignments</h2>
//               <p className={styles.pageSubtitle}>
//                 Manage task(s) for field executives
//               </p>
//             </div>
//             <div className={styles.searchActions}>
//               <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className={styles.siteSelect}
                disabled={sitesLoading || sites.length === 0}
              >
                 {sitesLoading && (
                    <option value="">Loading sites...</option>
                  )}
                  {!sitesLoading && sites.length === 0 && (
                  <option value="">No sites assigned</option>
                )}
                {!sitesLoading && sites.length > 0 && (
                    <>
                      <option value="">All Sites</option>
                      {sites.map((site) => (
                        <option key={site.site_id} value={site.site_id}>
                          {site.site_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>

              <div className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.employeesTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Site</th>
                  <th>Assigned Work</th>
                  <th>Task Status</th>

                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className={styles.loadingCell}>
                      <WevoisLoader height={"60vh"} />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "var(--textMuted)",
                      }}
                    >
                      No field executives found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.code} className={styles.tableRow}>
                      <td style={{ padding: "15px 20px", width: "25%" }}>
                        <div className={styles.employeeInfo}>
                          <div className={styles.avatar}>
                            {user.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className={styles.employeeName}>
                              {user.name}
                            </div>
                            <div
                              className={styles.employeeEmail}
                              style={{ color: "grey" }}
                            >
                              {user.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* <td className={styles.cellText}>{user.employee_code}</td> */}
                      <td className={styles.cellText}>
                        {user.contact || "N/A"}
                      </td>
                      <td style={{ padding: "15px 20px" }}>
                        <span>{user.site || "N/A"}</span>
                      </td>
                      <td
                        style={{ padding: "15px 20px", verticalAlign: "top" }}
                      >
                        <div>
                          <div>Total Tasks : {user.tasks}</div>
                          <div style={{ color: "grey" }}>
                            Estimated Time : {user.estimatedTime}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "15px 20px" }}>
                        <span
                          className={`${styles.statusBadge} ${user.status ? styles.statusActive : styles.statusInactive}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td style={{ padding: "15px 20px", textAlign: "center" }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className={styles.assignTaskBtn}
                            onClick={() =>
                              setAssignTaskWindow({ status: true, data: user })
                            }
                            title="Assign Task"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            className={styles.assignTaskBtn}
                            onClick={() =>
                              setAssignTaskWindow({ status: true, data: user })
                            }
                            title="Assign Task"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <AssignTask
          isOpen={assignTaskWindow.status}
          onClose={() => setAssignTaskWindow({ status: false, data: null })}
          data={assignTaskWindow.data}
        />
      </div>
    );
};

export default FEAssignments;
