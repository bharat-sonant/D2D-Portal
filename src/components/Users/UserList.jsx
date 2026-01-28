import { useState, useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import GlobalStyles from "../../assets/css/globalStyles.module.css";

import { images } from "../../assets/css/imagePath";
import userNotFound from "../../assets/images/icons/userNotFound.gif";
import styles from "./UserList.module.css";
import {
  filterUserListAction,
  handleApplyFilter,
} from "../../Actions/UserAction/UserAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import { UserRoundCheck, UserSearch } from "lucide-react";
import NoResult from "../NoResultFound/NoResult";
import GlobalDropdown from "../Common/GlobalDropdown/GlobalDropdown";

const UserList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filteredUsersList, setFilteredUsersList] = useState(
    props?.users || []
  );
  const [statusFilter, setStatusFilter] = useState("active");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dropdownMenuRef = useRef();

  useEffect(() => {
  debouncedFilter(props?.users, searchTerm);
}, [props?.users, searchTerm]);

const debouncedFilter = useMemo(
  () =>
    debounce((users, term) => {
      setFilteredUsersList(
        filterUserListAction(users, term, props?.setSelectedUser)
      );
    }, 300),
  []
);


const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};


  useEffect(() => {
    setFilteredUsersList(
      filterUserListAction(props?.users, searchTerm, props?.setSelectedUser)
    );
  }, [props?.users]);

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
  console.log(filteredUsersList)
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
            <div
              className={`${styles.userFilter} ${
                isSearchOpen ? styles.searchOpen : ""
              }`}
            >
              {/* All Status Filter */}

              {!isSearchOpen && (
                <GlobalDropdown
                  value={statusFilter}
                  labelMap={{
                    all: "All Status",
                    active: "Active",
                    inactive: "Inactive",
                  }}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    {
                      value: "inactive",
                      label: "Inactive",
                      rightElement: <span className={styles.redDot}></span>,
                    },
                  ]}
                  onChange={(val) => setStatusFilter(val)}
                />
              )}

              {/* User Type Filter */}
              {!isSearchOpen && (
                <GlobalDropdown
                  value={userTypeFilter}
                  labelMap={{
                    all: "All Users",
                    internal: "Internal",
                    external: "External",
                  }}
                  options={[
                    { value: "all", label: "All Users" },
                    { value: "internal", label: "Internal" },
                    {
                      value: "external",
                      label: "External",
                      rightIcon: <UserRoundCheck size={12} />,
                    },
                  ]}
                  onChange={(val) => setUserTypeFilter(val)}
                />
              )}
              <div
                className={`${styles.searchWrapper} ${
                  isSearchOpen ? styles.searchExpanded : styles.searchCollapsed
                }`}
              >
                <input
                  className={`${styles.inputSearch} ${
                    isSearchOpen ? styles.inputExpand : ""
                  }`}
                  type="text"
                  value={searchTerm}
                  placeholder={isSearchOpen ? "Search" : ""}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={handleSearch}
                />

                {isSearchOpen && (
                  <span
                    className={styles.closeIcon}
                    onClick={() => {setIsSearchOpen(false);setSearchTerm("");}}
                  >
                    ✕
                  </span>
                )}
              </div>
            </div>
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
                    <div className={styles.leftSection}>
                      {user?.name}
                      {user?.emp_code && <></>}
                    </div>
                    {/* RIGHT SIDE : Icons */}
                    <div className={styles.userMeta}>
                      {user?.user_type !== "external" && (
                        <span
                          className={`${styles.textHighlight} ${
                            props?.selectedUser?.id === user?.id
                              ? styles.selectedText
                              : ""
                          }`}
                        >
                          {user?.emp_code}
                        </span>
                      )}

                      {user?.user_type === "external" && (
                        <UserRoundCheck className={styles.listIcon} />
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
                gif={userNotFound}
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
