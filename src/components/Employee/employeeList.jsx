import { useEffect, useState, useRef } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import styles from "../../assets/css/Employee/EmployeeList.module.css";
import { images } from "../../assets/css/imagePath";
import "../../assets/css/checkbox.css";
import { PulseLoader } from "react-spinners";
import * as listAction from "../../actions/Employee/EmployeeListAction";

const EmployeeList = (props) => {
  const [selectedSeparatedUser, setSelectedSeparatedUser] = useState(" ");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [employeeSelect, setEmployeeSelect] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [checked, setchecked] = useState(false);

  const dropdownMenuRef = useRef(null);

  useEffect(() => {
    if (checked === false) {
      listAction.getEmployee(setLoading, props.setEmployeeData, props.setAllEmployeeData);
    } else {
      handleActiveInactiveUser(true);
    }
  }, [props.triggerList]);

  useEffect(() => {
    let filtered = Array.isArray(props.employeeData) ? props.employeeData : [];
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    props.setFilteredUsers(filtered);
    if (filtered.length > 0) {
      props.setPeopleEmpCode(filtered[0].empCode);
      setSelectedSeparatedUser(filtered[0].empCode);
      props.setEmployeeDetails(filtered[0]);
    } else {
      props.setPeopleEmpCode("");
      setSelectedSeparatedUser("");
      props.setEmployeeDetails({});
    }
  }, [searchTerm, props.employeeData]);

  const handleUserSelect = (user) => {
    props.setPeopleEmpCode(user.empCode);
    setSelectedSeparatedUser(user.empCode);
    props.setEmployeeDetails(user);
    setIsDropdownOpen(false);
    setIsDropdownOpen(false);
    dropdownMenuRef.current?.classList.remove("show");
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

  const handleSearch = (e) => {
    const term = e.target.value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, " ");
    setSearchTerm(term);
  };

  const handleActiveInactiveUser = (value) => {
    if (value === true) {
      setchecked(value);
      const filteredData = Array.isArray(props.allEmployeeData)
        ? props.allEmployeeData.filter((person) => Number(person.status) !== 1)
        : [];
      props.setEmployeeData(filteredData);
    } else {
      setchecked(value);
      const filteredData = Array.isArray(props.allEmployeeData)
        ? props.allEmployeeData.filter((person) => Number(person.status) !== 2)
        : [];
      props.setEmployeeData(filteredData);
    }
  };

  return (
    <div className={`dropdown ${GlobalStyles.dropDown}`}>
      <button
        className={`${GlobalStyles.dropdownBtn} ${styles.hideDesktop} ${isDropdownOpen ? GlobalStyles.dropdownRotate : ""
          }`}
        type="button"
        id="dropdownMenuButton"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
        onBlur={() => setTimeout(() => toggleDropdown(), 100)}
      >
        <h4
          className={`${GlobalStyles.dropdownText}`}
          style={{
            color: employeeSelect ? "#707070" : "#333333",
            fontWeight: employeeSelect ? "normal" : "500",
          }}
        >
          {selectedSeparatedUser ? props.filteredUsers.find(user => user.empCode === selectedSeparatedUser)?.name || "Select Employee" : "Select Employee"}

        </h4>
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
      >
        <ul
          ref={dropdownMenuRef}
          className={`dropdown-menu ${GlobalStyles.dropdownMenu} ${GlobalStyles.dropdownDesktop} ${styles.pageDropdown}`}
          style={{ display: isDesktop || isDropdownOpen ? "block" : "none" }}
          aria-labelledby="dropdownMenuButton"
        >
          <div className={`${GlobalStyles.searchGroup}`}>
            <input
              className={`${GlobalStyles.inputSearch}`}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className={`${styles.userListTitle}`}>Select Employee</div>
          <div className={`${styles.userScroll}`}>
            {loading ? (
              <div className={styles.loaderContainer}>
                <PulseLoader color="#3fb2f1" size={11} />
                <div className={`${GlobalStyles.loaderText}`}>
                  Loading employee, Please wait
                </div>
              </div>
            ) : props.filteredUsers.length > 0 ? (
              props.filteredUsers.map((user, i) => (
                <li className={`${GlobalStyles.dropdownLi}`} key={i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.dropdownItem} ${selectedSeparatedUser === user.empCode
                      ? GlobalStyles.selectedUser
                      : ""
                      }`}
                    style={{
                      backgroundColor:
                        selectedSeparatedUser === user.empCode
                          ? "#9acaf1"
                          : "transparent",
                      backgroundColor:
                        selectedSeparatedUser === user.empCode
                          ? "#3fb2f114"
                          : "transparent",
                    }}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div
                      className={`${GlobalStyles.userInfo}`}
                      style={{
                        color:
                          selectedSeparatedUser === user.empCode
                            ? "#000000"
                            : "#000000",
                      }}
                    >
                      <span className={`${styles.employeeName}`}>
                        {user.name}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className={`${styles.noUserData}`}>
                <img
                  src={images.noUser}
                  className={`img-fluid ${styles.noUserImg}`}
                  title="No User Found"
                  alt="Image"
                />
                No employee found !!!
              </div>
            )}
          </div>
          <div>
            <label
              className={`checkbox-container`}
              style={{ marginTop: "-17px" }}
            >
              <input
                type="checkbox"
                onChange={(e) => handleActiveInactiveUser(e.target.checked)}
              />
              <span className={`checkmark ${styles.checkMark}`}></span>
              <span className="label-text">Show Inactive Employee</span>
            </label>
          </div>
        </ul>
      </div>
    </div>
  );
};
export default EmployeeList;
