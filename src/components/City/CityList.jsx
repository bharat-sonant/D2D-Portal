import React, { useEffect, useRef } from "react";
import { useState } from "react";
import GlobalStyles from "../../assets/css/globalStyles.module.css";
import { images } from "../../assets/css/imagePath";
import cityNotFound from "../../assets/images/icons/cityNotFound.gif";
import styles from "./CityList.module.css";
import { debounce } from "lodash";
import { filterCityAction, getwardList } from "../../Actions/City/cityAction";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import NoResult from "../NoResultFound/NoResult";

const CityList = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCityList, setFilteredCityList] = useState(
    props?.cityList || []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dropdownMenuRef = useRef();
  useEffect(() => {
    setFilteredCityList(
      filterCityAction(
        props?.cityList,
        searchTerm,
        props?.setSelectedCity,
        props?.selectedCity
      )
    );
  }, [props?.cityList, searchTerm]);

  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

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
          className={`${GlobalStyles.selectedText} 
          ${props.selectedCity ? GlobalStyles.active : ""}`}
        >
          {props.selectedCity
            ? `${props.selectedCity.site_name}${
                props.selectedCity.site_id
                  ? ` (${props.selectedCity.site_id})`
                  : ""
              }`
            : "Select Site"}
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
          <div className={`${GlobalStyles.searchGroup}`}>
            <input
              className={`${GlobalStyles.inputSearch}`}
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
          <div className={`${styles.userListTitle}`}></div>
          <div className={styles.userScroll}>
            {props.loading ? (
              <WevoisLoader title="Loading site data..." />
            ) : filteredCityList?.length > 0 ? (
              filteredCityList.map((site, i) => (
                <li className={GlobalStyles.dropdownLi} key={site.site_id || i}>
                  <div
                    className={`dropdown-item ${GlobalStyles.desktopRow} ${
                      props?.selectedCity?.site_id === site.site_id
                        ? GlobalStyles.desktopRowSelected
                        : ""
                    }`}
                    onClick={() => {
                      props?.setSelectedCity(site);
                      closeDropdown();
                      getwardList(
                        site.site_id,
                        props.setWardList,
                        props.setSelectedWard
                      );
                    }}
                  >
                    <div className={styles.leftSection}>{site.site_name}</div>
                    <div className={styles.userMeta}>
                      {site.status === "inactive" && (
                        <span className={styles.redDot}></span>
                      )}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <NoResult
                title="Site Not Found"
                query={searchTerm}
                gif={cityNotFound}
                height="calc(100vh - 280px)"
              />
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(CityList);
