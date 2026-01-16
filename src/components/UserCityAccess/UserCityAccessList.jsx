import React, { useState, useMemo } from "react";
import GlobalStyles from "../../assets/css/globalStyles.module.css";
import styles from "./UserCityAccessList.module.css";
import NoResult from "../NoResultFound/NoResult";
import userNotFound from "../../assets/images/icons/userNotFound.gif";
import WevoisLoader from "../Common/Loader/WevoisLoader";

const UserCityAccessList = ({
  userList = [],
  selectedUserId,
  onSelectUser,
  loading,
  isEmbedded = false,
}) => {
  // const [searchQuery, setSearchQuery] = useState("");
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
    <>
      <div className={styles.userCard}>
        <div className={styles.cardHeader}>
          <div className={styles.heading}>Vehicles</div>
        </div>
        {/* Search */}
        <input
          className={GlobalStyles.inputSearch}
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.scrollList}>
          {loading ? (
            <WevoisLoader
              title={"Please wait... Loading users."}
              height="250px"
            />
          ) : filteredUsers.length > 0 ? (
            isEmbedded ? (
              <div className={styles.cardLayout}>
                {filteredUsers.map((user, i) => (
                  <div
                    className={styles.card}
                    key={i}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className={styles.cardLeft}>
                      <div className={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className={styles.cardData}>
                        {user.name}
                        <p> {user.role || "User"}</p>
                      </div>
                    </div>
                    {user.status === "inactive" && (
                      <div className={styles.cardRight}>
                        <span
                          className={styles.redDot}
                          style={{ marginLeft: "auto" }}
                        ></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // 🔹 LIST VIEW for Dropdown (Original)
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
            <NoResult
              title="User Not Found"
              // query={searchQuery}
              gif={userNotFound}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserCityAccessList;
