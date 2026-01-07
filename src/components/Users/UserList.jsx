import { useState, useEffect } from "react";
import { debounce } from "lodash";
import GlobalStyles from "../../assets/css/globalStyles.module.css";

import { images } from "../../assets/css/imagePath";
import styles from "./UserList.module.css";
import {
  filterUserListAction,
  handleApplyFilter,
} from "../../Actions/UserAction/UserAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import { UserRoundCheck, UserSearch } from "lucide-react";
import NoResult from "../NoResultFound/NoResult";

const UserList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filteredUsersList, setFilteredUsersList] = useState(
    props?.users || []
  );
  const [statusFilter, setStatusFilter] = useState("active");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isUserTypeOpen, setIsUserTypeOpen] = useState(false);
  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  useEffect(() => {
    setFilteredUsersList(
      filterUserListAction(props?.users, searchTerm, props?.setSelectedUser)
    );
  }, [props?.users, searchTerm]);

  useEffect(() => {
    handleApplyFilter(
      props.activeInactiveUserList,
      setFilteredUsersList,
      statusFilter,
      userTypeFilter,
      props.setSelectedUser,
      props.setUsers
    );
  }, [statusFilter, userTypeFilter, props.activeInactiveUserList]);

  // Dropdown menu for the Mobile and Desktop (hide and show)
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const toggleDropdown = () => {
    const newDropdownState = !isDropdownOpen;
    setIsDropdownOpen(newDropdownState);

    if (dropdownMenuRef.current) {
      if (newDropdownState) {
        dropdownMenuRef.current.classList.add("show");
        document.body.classList.add("no-scroll");
      } else {
        dropdownMenuRef.current.classList.remove("show");
        document.body.classList.remove("no-scroll");
      }
    }
  };
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);
    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);
  // Dropdown menu for the Mobile and Desktop (hide and show) - Ends Here
  const closeCurrentDropdown = (e) => {
    const dropdownMenu = e.target.closest(".dropdown-menu");
    if (!dropdownMenu) return;

    const dropdown = dropdownMenu.closest(".dropdown");
    if (!dropdown) return;

    const btn = dropdown.querySelector('[data-bs-toggle="dropdown"]');
    if (btn) btn.click(); // 🔥 bootstrap dropdown close
  };
  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <button
        className={`${GlobalStyles.mobileBtn}  ${
          isDropdownOpen ? GlobalStyles.dropdownRotate : ""
        }`}
        type="button"
        id="dropdownMenuButton"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        <div
          className={`${GlobalStyles.selectedText} ${
            props.selectedUser ? GlobalStyles.active : ""
          }`}
        >
          {props.selectedUser
            ? `${props.selectedUser.name}${
                props.selectedUser.emp_code
                  ? ` (${props.selectedUser.emp_code})`
                  : ""
              }`
            : "Select User"}
        </div>
        <img
          src={images.iconDown}
          className={`${GlobalStyles.iconDown}`}
          title="Icon Down"
          alt="Dropdown Arrow"
        />
      </button>
      <div
        className={`${GlobalStyles.overlay}`}
        style={{ display: isDesktop || isDropdownOpen ? "block" : "none" }}
        onClick={closeDropdown}
      >
        <ul
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} }`}
          style={{ display: isDesktop || isDropdownOpen ? "block" : "none" }}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby="drop downMenuButton"
        >
          {/* FILTER BAR */}
          <div className={`${styles.userFilterBG}`}>
            <div className={`${styles.userFilter}`}>
              <div className="dropdown" style={{ flex: 1 }}>
                <button
                  className={styles.customDropdownBtn}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStatusOpen((prev) => !prev);
                    setIsUserTypeOpen(false); // dusra band
                  }}
                >
                  {statusFilter === "all"
                    ? "All Status"
                    : statusFilter === "active"
                    ? "Active"
                    : "Inactive"}
                </button>

                {isStatusOpen && (
                  <ul
                    className={`dropdown-menu w-100 ${styles.customDropdownMenu} show`}
                  >
                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          statusFilter === "all" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("all");
                          setIsStatusOpen(false); // ✅ sirf child close
                        }}
                      >
                        All Status
                      </button>
                    </li>

                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          statusFilter === "active" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("active");
                          setIsStatusOpen(false);
                        }}
                      >
                        Active
                        {/* <div className={styles.greenDot}></div> */}
                      </button>
                    </li>

                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          statusFilter === "inactive" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setStatusFilter("inactive");
                          setIsStatusOpen(false);
                        }}
                      >
                        Inactive
                        <div className={styles.redDot}></div>
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* User Type Filter */}
              <div className="dropdown" style={{ flex: 1 }}>
                {/* BUTTON */}
                <button
                  className={styles.customDropdownBtn}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserTypeOpen((prev) => !prev);
                    setIsStatusOpen(false); // 🔒 status dropdown band
                  }}
                >
                  {userTypeFilter === "all"
                    ? "All Users"
                    : userTypeFilter === "internal"
                    ? "Internal"
                    : "External"}
                </button>

                {/* DROPDOWN MENU */}
                {isUserTypeOpen && (
                  <ul
                    className={`dropdown-menu w-100 ${styles.customDropdownMenu} show`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          userTypeFilter === "all" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setUserTypeFilter("all");
                          setIsUserTypeOpen(false); // ✅ sirf ye dropdown close
                        }}
                      >
                        All Users
                      </button>
                    </li>

                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          userTypeFilter === "internal" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setUserTypeFilter("internal");
                          setIsUserTypeOpen(false);
                        }}
                      >
                        Internal
                      </button>
                    </li>

                    <li className={styles.dropdownLi}>
                      <button
                        className={`${styles.dropdownItem} ${
                          userTypeFilter === "external" ? styles.active : ""
                        }`}
                        onClick={() => {
                          setUserTypeFilter("external");
                          setIsUserTypeOpen(false);
                        }}
                      >
                        External
                        <div className={``}>
                          {" "}
                          <UserRoundCheck size={14} />{" "}
                        </div>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
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
              <WevoisLoader
                title={"Loading user data..."}
                height="calc(100vh - 250px)"
              />
            ) : filteredUsersList?.length > 0 ? (
              filteredUsersList?.map((user, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`${GlobalStyles.desktopRow} ${
                      props?.selectedUser?.id === user?.id
                        ? GlobalStyles.desktopRowSelected
                        : ""
                    }`}
                    onClick={() => {
                      props?.setSelectedUser(user);
                      closeDropdown(); // ✅ close on select
                    }}
                  >
                    <div>
                      {user?.name}
                      {user?.emp_code && (
                        <>
                          <span className={`${styles.textHighlight}`}>
                            {" "}
                            ({user.emp_code})
                          </span>
                        </>
                      )}
                    </div>
                    {/* RIGHT SIDE : Icons */}
                    <div>
                      {user?.user_type === "external" && (
                        <UserRoundCheck size={14} />
                      )}

                      {user?.status === "inactive" && (
                        <span className={styles.redDot}></span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <NoResult
                title="No Users Found"
                query={searchTerm}
                icon={UserSearch}
                height="calc(100vh - 280px)"
              />
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default UserList;
