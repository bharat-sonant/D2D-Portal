import { useState, useEffect } from "react";
import cityNotFound from "../../assets/images/icons/cityNotFound.gif";
import userNotFound from "../../assets/images/icons/userNotFound.gif";
import { Search } from "lucide-react";
import style from "../../assets/css/User/UserCityAccess.module.css";
import * as userAction from "../../Actions/UserAction/UserAction";
import NoResult from "../NoResultFound/NoResult";
import GlobalCheckbox from "../Common/GlobalCheckbox/GlobalCheckbox";

const UserCityAccess = (props) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (props.selectedUser?.id) {
      userAction.handleGetCity(props.selectedUser.id, setSelectedCities,props.SetAssignedSiteList);
    } else {
      setSelectedCities([]);
    }
  }, [props.selectedUser?.id]);

  const handleCheckboxChange = async (siteId) => {
    if (!props.selectedUser?.id) {
      return;
    }
    const isCurrentlySelected = selectedCities.some(
      (c) => c.city_id === siteId
    );

    await userAction.handleCityAccessToggle(
      props.selectedUser?.id,
      siteId,
      isCurrentlySelected,
      setSelectedCities,
      selectedCities,
      props.SetAssignedSiteList
    );
  };
  const filteredCityList = props.cityList?.filter((item) =>
    item.site_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={style.Detailscard}>
      <div className={style.card_header}>
        {!isSearching ? (
          <>
            <h5 className={style.heading}>User Site Access</h5>

            <Search
              size={14}
              className={style.searchIcon}
              onClick={() => {
                setIsSearching(true);
                setSearchTerm("");
              }}
              title="Search"
            />
          </>
        ) : (
          <div className={style.searchWrapper}>
            <input
              type="text"
              className={style.searchInput}
              placeholder="Search site..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* ❌ Close Icon */}
            <span
              className={style.closeIcon}
              onClick={() => {
                setSearchTerm("");
                setIsSearching(false);
              }}
              title="Close"
            >
              ✕
            </span>
          </div>
        )}
      </div>

      <div className={style.Scroll_List}>
        {!props.selectedUser ? (
          <div className={style.dropdownItemNot}>
            <img
              src={userNotFound}
              alt="User not found"
              className={style.notFoundImg}
            />
            Please select a user to manage city access.
          </div>
        ) : filteredCityList && filteredCityList.length > 0 ? (
          <ul className={style.listLine}>
            {filteredCityList.map((item, index) => (
              <li key={index} className={style.list_item}>
                <GlobalCheckbox
                  label={item.site_name}
                  checked={selectedCities.some(
                    (c) => c.city_id === item.site_id
                  )}
                  onChange={() => handleCheckboxChange(item.site_id)}
                  disabled={loading}
                  align="right"
                  fullWidth
                />
              </li>
            ))}
          </ul>
        ) : (
          <NoResult title="No Site Found" gif={cityNotFound} height="340px" />
        )}
      </div>
    </div>
  );
};

export default UserCityAccess;
