import { useEffect, useState } from "react";
import { Building2, Grid3x3, Truck, Users } from "lucide-react";

import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "./City.module.css";
import CityList from "../../components/City/CityList";
import AddCity from "../../components/City/AddCity";
import SettingsBtn from "../../components/Common/SettingsBtn";
import CitySettings from "../../components/City/CitySettings";
import ConfirmationModal from "../../components/confirmationModal/ConfirmationModal";
import {
  changeCityStatusAction,
  getCityList,
} from "../../Actions/City/cityAction";
import WardList from "../../components/City/WardList";
import AddWard from "../../components/City/AddWard";
import AddVehiclesCard from "../../components/City/AddVehiclesCard";
import UserCityAccessList from "../../components/UserCityAccess/UserCityAccessList";
import { getUsersByCity } from "../../Actions/City/UserCityAccessAction";
import { saveFirebaseConfigAction } from "../../Actions/City/firebaseConfigAction";
import LogoImage from "../../components/Common/Image/LogoImage";

import WardSetting from "../../components/City/WardSetting";

const TABS = [
  { key: "city", label: "City Details", icon: Building2 },
  { key: "wards", label: "Wards", icon: Grid3x3 },
  { key: "vehicle", label: "Vehicles", icon: Truck },
  { key: "users", label: "Users In City", icon: Users },
];

const City = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [openAddWardPopUp, setOpenAddWardPopUp] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [statusConfirmation, setStatusConfirmation] = useState({
    status: false,
    data: null,
    setToggle: () => {},
  });
  const [wardList, setWardList] = useState([]);
  const [editWard, setEditWard] = useState({ ward: "", wardId: "" });
  const [activeTab, setActiveTab] = useState("city");
  const [usersInCity, setUsersInCity] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedWard, setSelectedWard] = useState("");

  const loadCities = async () => {
    getCityList(
      setSelectedCity,
      setCityList,
      selectedCity,
      setWardList,
      setLoading,
      setSelectedWard
    );
  };

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    if (activeTab === "users" && selectedCity?.city_id) {
      getUsersByCity(selectedCity.city_id, setUsersInCity, setLoadingUsers);
    }
  }, [activeTab, selectedCity]);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const handleOpenEditWindow = () => {
    setOpenSettings(false);
    setShowCanvas(true);
    setOnEdit(selectedCity);
  };
  const handleStatusConfirmation = () => {
    changeCityStatusAction(
      statusConfirmation?.data,
      selectedCity,
      statusConfirmation?.setToggle,
      loadCities,
      setStatusConfirmation
    );
  };

  const handleSaveFirebaseConfig = async (dbPath, setLoader) => {
    await saveFirebaseConfigAction(
      selectedCity.city_id || selectedCity.CityId,
      dbPath, // Pass string directly
      setLoader,
      () => {
        loadCities(); // Refresh city list to get updated config
      }
    );
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        {activeTab === "city" && (
          <>
            {/* {selectedCity && <SettingsBtn click={handleOpenSettings} />} */}
            <button
              className={`${GlobalStyles.floatingBtn}`}
              onClick={handleOpenModal}
            >
              +
            </button>
          </>
        )}
      </div>

      <div className={`${TaskStyles.cityPage}`}>
        <div className={`${TaskStyles.cityPageLeft}`}>
          <CityList
            cityList={cityList}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            setWardList={setWardList}
            setLoading={setLoading}
            loading={loading}
            setSelectedWard={setSelectedWard}
          />
        </div>

        {selectedCity !== null && (
          <div className={TaskStyles.cityPageRight}>
            <div className={TaskStyles.tabContainer}>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${TaskStyles.tabButton} ${
                      activeTab === tab.key ? TaskStyles.active : ""
                    }`}
                  >
                    <div className={TaskStyles.tabIconBG}>
                      <Icon size={16} className={TaskStyles.tabIcon} />
                    </div>
                    <span className={TaskStyles.tabName}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === "city" && (
              <div className={TaskStyles.cityCard}>
                <div className={TaskStyles.cityLeft}>
                  <LogoImage image={selectedCity?.logoUrl} />
                  <span className={TaskStyles.userName}>
                    {selectedCity?.city_code || "N/A"}
                    <p>Manage permissions, city access and more</p>
                  </span>
                </div>

                <div className={TaskStyles.cityRight}>
                  {activeTab === "city" && (
                    <>
                      {selectedCity && (
                        <SettingsBtn click={handleOpenSettings} />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            {activeTab === "wards" && (
              <>
                <div
                className={`${TaskStyles.wardTab}`}
                >
                  <WardList
                    setOpenAddWardPopUp={setOpenAddWardPopUp}
                    wardList={wardList}
                    setWardList={setWardList}
                    setEditWard={setEditWard}
                    setSelectedWard={setSelectedWard}
                    selectedWard={selectedWard}
                    setOnEdit={setOnEdit}
                  />
                  {selectedWard !== undefined && (
                    <WardSetting
                      selectedWard={selectedWard}
                      setWardList={setWardList}
                      selectedCity={selectedCity}
                    />
                  )}
                </div>
              </>
            )}

            <div>
              {activeTab === "vehicle" && (
                <div className={TaskStyles.cardWrapper}>
                  <AddVehiclesCard selectedCity={selectedCity} />
                </div>
              )}

              {activeTab === "users" && (
                <div className={TaskStyles.cardWrapper}>
                  <UserCityAccessList
                    selectedCity={selectedCity}
                    userList={usersInCity}
                    loading={loadingUsers}
                    isEmbedded={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCanvas && (
        <AddCity
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          loadCities={loadCities}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
        />
      )}
      {openSettings && (
        <CitySettings
          openCanvas={openSettings}
          onHide={handleCloseSettings}
          selectedCity={selectedCity}
          onClickEdit={handleOpenEditWindow}
          setStatusConfirmation={setStatusConfirmation}
          onSaveFirebaseConfig={handleSaveFirebaseConfig}
        />
      )}

      {openAddWardPopUp && (
        <AddWard
          openAddWardPopUp={openAddWardPopUp}
          setOpenAddWardPopUp={setOpenAddWardPopUp}
          setEditWard={setEditWard}
          editWard={editWard}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          selectedCity={selectedCity}
          setWardList={setWardList}
          wardList={wardList}
          setSelectedWard={setSelectedWard}
        />
      )}
      {statusConfirmation?.status && (
        <ConfirmationModal
          visible={statusConfirmation?.status}
          title={`City ${statusConfirmation?.data ? "Active" : "Deactive"}`}
          message={`Are you sure you want to ${
            statusConfirmation?.data ? "activate" : "deactivate"
          } ${selectedCity?.city_name} city?`}
          onCancel={() =>
            setStatusConfirmation({
              status: false,
              data: null,
              setToggle: () => {},
            })
          }
          onConfirm={handleStatusConfirmation}
          btnColor={!statusConfirmation?.data && "red"}
        />
      )}
    </>
  );
};

export default City;
