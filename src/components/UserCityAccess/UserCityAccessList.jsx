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
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${isEmbedded ? "" : GlobalStyles.dropdownDesktop
            } ${styles.pageDropdown}`}
          style={{
            display: "block",
            position: isEmbedded ? "static" : "static",
            width: "100%",
            border: isEmbedded ? "none" : "none",
            boxShadow: isEmbedded ? "none" : "none",
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

          <div style={{ height: "calc(100vh - 270px)", overflowY: "auto", overflowX: "hidden" }}>
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
              isEmbedded ? (
                // 🔹 GRID VIEW for City Page
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px", padding: "10px 0" }}>
                  {filteredUsers.map((user, i) => (
                    <div
                      key={i}
                      onClick={() => handleUserSelect(user)}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        background: selectedUserId === user.id ? "#f0f9ff" : "#fff",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)";
                      }}
                    >
                      {/* Avatar Placeholder */}
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#6B7FDE",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "16px",
                        flexShrink: 0
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {user.role || "User"}
                        </div>
                      </div>

                      {user.status === "inactive" && (
                        <span className={styles.redDot} style={{ marginLeft: "auto" }}></span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // 🔹 LIST VIEW for Dropdown (Original)
                filteredUsers.map((user, i) => (
                  <li className={GlobalStyles.dropdownLi} key={i}>
                    <div
                      className={`dropdown-item ${GlobalStyles.dropdownItem} ${selectedUserId === user.id
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
                        <span className={styles.employeeName}>{user.name}</span>
                        {user.status === "inactive" && (
                          <span className={styles.redDot}></span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )
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
