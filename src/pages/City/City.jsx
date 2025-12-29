import { useEffect, useState } from "react";
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import CityList from "../../components/City/CityList";
import AddCity from "../../components/City/AddCity";
import SettingsBtn from "../../components/Common/SettingsBtn";
import CitySettings from "../../components/City/CitySettings";
import ConfirmationModal from "../../components/confirmationModal/ConfirmationModal";
import { changeCityStatusAction, getCityList } from "../../Actions/City/cityAction";
import WardList from "../../components/City/WardList";
import AddWard from "../../components/City/AddWard";
import AddVehiclesCard from "../../components/City/AddVehiclesCard";

const City = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [openAddWardPopUp, setOpenAddWardPopUp] = useState(false)
  const [cityList, setCityList] = useState([]);
   const [loading,setLoading]=useState(false)
  const [selectedCity, setSelectedCity] = useState(null);
  const [onEdit, setOnEdit] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [statusConfirmation, setStatusConfirmation] = useState({ status: false, data: null, setToggle: () => { } });
  const [wardList, setWardList] = useState([])
  const [editWard,setEditWard]=useState({ward:'',wardId:''})
  const loadCities = async () => {
    getCityList(setSelectedCity, setCityList, selectedCity, setWardList,setLoading)
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleOpenModal = () => {
    setShowCanvas(true);
  };
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const handleOpenEditWindow = () => {
    setOpenSettings(false);
    setShowCanvas(true);
    setOnEdit(selectedCity);
  }
  const handleStatusConfirmation = () => {
    changeCityStatusAction(
      statusConfirmation?.data,
      selectedCity,
      statusConfirmation?.setToggle,
      loadCities,
      setStatusConfirmation,
    );
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        {selectedCity && <SettingsBtn click={handleOpenSettings} />}
        <button
          className={`${GlobalStyles.floatingBtn}`}
          onClick={handleOpenModal}
        >
          +
        </button>
      </div>

      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`}>
          <CityList
            cityList={cityList}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            setWardList={setWardList}
            setLoading={setLoading}
             loading={loading}
          />
        </div>

        {selectedCity !== null && (
          <div className={TaskStyles.employeeRight}>
            <div
              style={{
                width: "25%",
                background: "#fff",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    background: "#f2f2f2",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedCity?.CityCode || "N/A"}
                </span>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    overflow: "hidden",
                  }}
                >
                  {selectedCity?.logoUrl && (
                    <img
                      src={selectedCity?.logoUrl || "/city-placeholder.png"}
                      alt="City Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <WardList setOpenAddWardPopUp={setOpenAddWardPopUp} wardList={wardList}  setEditWard={setEditWard}/>
              <AddVehiclesCard />
            </div>
          </div>
        )}
      </div>

      <div className={GlobalStyles.mainSections}>
        {showCanvas && (
          <AddCity
            showCanvas={showCanvas}
            setShowCanvas={setShowCanvas}
            loadCities={loadCities}
            onEdit={onEdit}
            setOnEdit={setOnEdit}

          />
        )}
      </div>
      {openSettings && (
        <CitySettings
          openCanvas={openSettings}
          onHide={handleCloseSettings}
          selectedCity={selectedCity}
          onClickEdit={handleOpenEditWindow}
          setStatusConfirmation={setStatusConfirmation}
        />
      )}
      <div className={GlobalStyles.mainSections}>
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
          />
        )}
      </div>
      {statusConfirmation?.status && (
        <ConfirmationModal
          visible={statusConfirmation?.status}
          title={`City ${statusConfirmation?.data ? 'Active' : 'Deactive'}`}
          message={`Are you sure you want to ${statusConfirmation?.data ? 'activate' : 'deactivate'} ${selectedCity?.CityName} city?`}
          onCancel={() => setStatusConfirmation({ status: false, data: null, setToggle: () => { } })}
          onConfirm={handleStatusConfirmation}
          btnColor={!statusConfirmation?.data && 'red'}
        />
      )}
    </>
  );
};

export default City;
