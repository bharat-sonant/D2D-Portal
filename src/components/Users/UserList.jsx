import { useState, useEffect } from "react";
import { debounce } from "lodash";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import { images } from "../../assets/css/imagePath";
import styles from "../../Style/Common/CommonListLayout.module.css";
import { filterUserListAction, handleApplyFilter } from "../../Actions/UserAction/UserAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import { FaUserCheck } from "react-icons/fa6";


const UserList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsersList, setFilteredUsersList] = useState(props?.users || []);
  const [statusFilter, setStatusFilter] = useState('active')
  const [userTypeFilter, setUserTypeFilter] = useState('all')
  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  useEffect(() => {
    setFilteredUsersList(
      filterUserListAction(props?.users, searchTerm, props?.setSelectedUser)
    );
  }, [props?.users, searchTerm]);


  useEffect(() => {
    handleApplyFilter(props.activeInactiveUserList, setFilteredUsersList, statusFilter, userTypeFilter, props.setSelectedUser, props.setUsers)
  }, [statusFilter, userTypeFilter, props.activeInactiveUserList]);


  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div className={`${GlobalStyles.overlay}`} style={{ display: "block" }}>
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{
            display: "block",
            width: "350px",
          }}
          aria-labelledby="drop downMenuButton"
        >
          {/* FILTER BAR */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "8px 12px"
            }}
          >

            <div
              style={{
                position: "relative",
                flex: 1
              }}
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 36px 9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  cursor: "pointer",
                  appearance: "none",          // 🔥 default arrow remove
                  WebkitAppearance: "none",
                  MozAppearance: "none"
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Custom Arrow */}
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "12px",
                  color: "#6b7280"
                }}
              >
                ▼
              </span>
            </div>


            {/* User Type Filter */}
            <div
              style={{
                position: "relative",
                flex: 1
              }}
            >
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 36px 9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                  cursor: "pointer",
                  appearance: "none",          // 🔥 default arrow remove
                  WebkitAppearance: "none",
                  MozAppearance: "none"
                }}
              >
                <option value="all">All Users</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>

              {/* Custom Arrow */}
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: "12px",
                  color: "#6b7280"
                }}
              >
                ▼
              </span>
            </div>

          </div>


          <div className={`${GlobalStyles.searchGroup}`}>
            <input
              className={`${GlobalStyles.inputSearch}`}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
          <div className={`${styles.userListTitle}`}>Select Employee</div>
          <div className={`${styles.userScroll}`}>
            {props?.loading ? (
              <WevoisLoader title={"Loading user data..."} />
            ) : filteredUsersList?.length > 0 ? (
              filteredUsersList?.map((user, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem}${props?.selectedUser?.id === user?.id
                        ? GlobalStyles.selectedUser
                        : ""
                      }`}
                    style={{
                      backgroundColor:
                        props?.selectedUser.id === user?.id
                          ? "#9acaf1"
                          : "transparent",
                      backgroundColor:
                        props?.selectedUser?.id === user?.id
                          ? "#3fb2f114"
                          : "transparent",
                    }}
                    onClick={() => props?.setSelectedUser(user)}
                  >
                    <div
                      className={GlobalStyles.userInfo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        color: "#000000"
                      }}
                    >
                      {/* LEFT SIDE : Name */}
                      <span
                        className={styles.employeeName}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1
                        }}
                      >
                        {user?.name}
                        {user?.empCode && (
                          <> [<strong>{user.empCode}</strong>]</>
                        )}
                      </span>

                      {/* RIGHT SIDE : Icons */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          minWidth: "50px",
                          justifyContent: "flex-end"
                        }}
                      >
                        {user?.userType === "external" && <FaUserCheck color="#212121" />}

                        {user?.status === "inactive" && (
                          <span className={styles.redDot}></span>
                        )}
                      </div>
                    </div>

                  </div>
                </li>
              ))
            ) : (
              <div className={`${styles.noUserData}`}>
                <img
                  src={images.imgComingSoon}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No User Found"
                  alt="Image"
                />
                No user found
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default UserList;
