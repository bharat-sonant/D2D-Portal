import React, { useState, useMemo } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import { images } from "../../assets/css/imagePath";
import styles from "../../Style/UserCityAccess/UserCityAccess.module.css";

const UserCityAccessList = ({
  userList = [],
  selectedUserId,
  onSelectUser,
  loading,
  isEmbedded = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleUserSelect = (user) => {
    onSelectUser && onSelectUser(user);
  };

  const filteredUsers = useMemo(() => {
    return [...userList].filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userList, searchTerm]);

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <div className={GlobalStyles.overlay} style={{ display: "block" }}>
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${
            isEmbedded ? "" : GlobalStyles.dropdownDesktop
          } ${styles.pageDropdown}`}
          style={{
            display: "block",
            position: isEmbedded ? "static" : "absolute",
            width: "25%",
            border: isEmbedded ? "none" : "",
            boxShadow: isEmbedded ? "none" : "",
          }}
        >
          {/* Search */}
          <div className={GlobalStyles.searchGroup}>
            <input
              className={GlobalStyles.inputSearch}
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {!isEmbedded && (
            <div className={styles.userListTitle}>Select Users</div>
          )}

          <div style={{ height: "calc(100vh - 270px)", overflow: "auto" }}>
            {loading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.cityLoaderWrapper}>
                  <div className={styles.cityLoader}></div>
                  <img
                    src={images.wevoisLogo}
                    alt="loader"
                    className={styles.centerIcon}
                  />
                </div>
                <div className={styles.loaderText}>
                  Please wait... Loading users.
                </div>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, i) => (
                <li className={GlobalStyles.dropdownLi} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} ${
                      selectedUserId === user.id
                        ? GlobalStyles.selectedUser
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedUserId === user.id
                          ? "#3fb2f114"
                          : "transparent",
                    }}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div
                      className={`${GlobalStyles.userInfo} d-flex justify-content-between align-items-center w-100`}
                    >
                      {/* Left */}
                      <span className={styles.employeeName}>{user.name}</span>

                      {/* Status dot */}
                      {user.status === "inactive" && (
                        <span className={styles.redDot}></span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className={styles.noUserData}>
                <img
                  src={images.imgComingSoon}
                  className={styles.noUserImg}
                  alt="No User Found"
                />
                No users found
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default UserCityAccessList;
