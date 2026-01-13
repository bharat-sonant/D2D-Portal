import { useState, useEffect } from "react";
import cityNotFound from "../../assets/images/icons/cityNotFound.gif";
import userNotFound from "../../assets/images/icons/userNotFound.gif";
import { Search } from "lucide-react";
import style from "../../assets/css/User/UserCityAccess.module.css";
import * as userAction from "../../Actions/UserAction/UserAction";
import NoResult from "../NoResultFound/NoResult";
import GlobalCheckbox from "../Common/GlobalCheckbox/GlobalCheckbox";

const UserCityAccess = (props) => {
  //   console.log("props", props);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (props.selectedUser?.id) {
      userAction.handleGetCity(props.selectedUser.id, setSelectedCities);
    } else {
      setSelectedCities([]);
    }
  }, [props.selectedUser?.id]);

  const handleCheckboxChange = async (city_id) => {
    if (!props.selectedUser?.id) {
      return;
    }
    const isCurrentlySelected = selectedCities.some(
      (c) => c.city_id === city_id
    );

    await userAction.handleCityAccessToggle(
      props.selectedUser?.id,
      city_id,
      isCurrentlySelected,
      setSelectedCities,
      setLoading,
      selectedCities
    );
  };
  const filteredCityList = props.cityList?.filter((item) =>
    item.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className={style.Detailscard}>
      <div className={style.card_header}>
        {!isSearching ? (
          <>
            <h5 className={style.heading}>User City Access</h5>

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
              placeholder="Search city..."
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
                  label={item.city_name}
                  checked={selectedCities.some(
                    (c) => c.city_id === item.city_id
                  )}
                  onChange={() => handleCheckboxChange(item.city_id)}
                  disabled={loading}
                />
              </li>
            ))}
          </ul>
        ) : (
          <NoResult title="No Cities Found" gif={cityNotFound} height="340px" />
        )}
      </div>
    </div>
  );
};

export default UserCityAccess;
