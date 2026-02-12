import { useEffect, useRef, useState } from 'react';
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import WardList from '../../components/Monitoring/WardList';
import { getDutySummaryAction, getWardBoundryAction, getWardDailyWorkSummaryAction, getWardList } from '../../Actions/Monitoring/WardAction';
import { useCity } from '../../context/CityContext';
import WardMonitoringPanel from '../../components/Monitoring/WardMonitoringPanel';
import dayjs from 'dayjs';
import { ChevronUp, ChevronDown } from 'lucide-react';
import monStyles from '../../components/Monitoring/WardMonitoring.module.css';

const Monitoring = () => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cityId, city } = useCity();
  const [dutySummary, setDutySummary] = useState(null);
  const [dutyLoading, setDutyLoading] = useState(false);
  const year = dayjs().format('YYYY');
  const month = dayjs().format('MMMM');
  const date = dayjs().format('YYYY-MM-DD');
  const mapRef = useRef(null);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);
  const [wardLineGeoJsonData, setWardLineGeoJsonData] = useState(null);
  const [boundryLoading, setBoundryLoading] = useState(false);
  const [hasPositioned, setHasPositioned] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showZoneSummary, setShowZoneSummary] = useState(false);

  const loadWards = async () => {
    getWardList(setSelectedWard, setWardList, selectedWard, setLoading, cityId);
  };

  useEffect(() => {
    loadWards();
  }, [cityId]);

  useEffect(() => {
    setWardBoundaryGeoJsonData(null);
    setWardLineGeoJsonData(null);
    fetchDutyIntime();
    fetchWardBoundry();
  }, [selectedWard?.id, cityId]);

  useEffect(() => {
    setHasPositioned(false);
    setMapLoaded(false);
    if (mapRef.current) {
      mapRef.current = null;
    }
  }, [selectedWard?.id]);


  const fetchWardBoundry = async () => {
    if (!selectedWard) return;
    await getWardBoundryAction(cityId, selectedWard?.id, setWardBoundaryGeoJsonData, setWardLineGeoJsonData, setBoundryLoading);
  };

  const fetchDutyIntime = async () => {
    if (!selectedWard) return;
    setDutyLoading(true);
    const result = await getWardDailyWorkSummaryAction(date, selectedWard, cityId, setDutyLoading);
    if (result) {
      setDutySummary(result);
    } else {
      setDutySummary(null);
    }
  };

  return (
    <>
      <div className={`${GlobalStyles.floatingDiv}`}>
        {/* {selectedWard && <SettingsBtn 
        click={handleOpenSettings}
         />} */}
        {/* <button
          className={`${GlobalStyles.floatingBtn}`}
          onClick={handleOpenModal}
        >
          +
        </button> */}
      </div>
      <div className={`${TaskStyles.employeePage}`}>
        <div className={`${TaskStyles.employeeLeft}`} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <WardList
              wardList={wardList}
              selectedWard={selectedWard}
              setSelectedWard={setSelectedWard}
              loading={loading}
            />
          </div>
          {/* 🟢 ZONE PROGRESS SUMMARY */}
          <div className={monStyles.zoneSummaryContainer}>
            <div
              className={monStyles.zoneSummaryHeader}
              onClick={() => setShowZoneSummary(!showZoneSummary)}
            >
              <span>Zone Progress Summary</span>
              {showZoneSummary ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </div>
            {showZoneSummary && (
              <div className={monStyles.zoneSummaryBody}>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Total Zone</span>
                  <span className={monStyles.zoneValue}>74</span>
                </div>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Completed Zone</span>
                  <span className={monStyles.zoneValue}>14</span>
                </div>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Active Zone</span>
                  <span className={monStyles.zoneValue}>39</span>
                </div>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Inactive Zone</span>
                  <span className={monStyles.zoneValue}>13</span>
                </div>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Stop Zone</span>
                  <span className={monStyles.zoneValue}>8</span>
                </div>
                <div className={monStyles.zoneItem}>
                  <span className={monStyles.zoneLabel}>Garage Duty</span>
                  <span className={monStyles.zoneValue}>0/0</span>
                </div>
                <div className={monStyles.heroItem}>
                  <span className={monStyles.zoneLabel}>Heros on Work</span>
                  <span className={monStyles.zoneValue}>115</span>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className={`${TaskStyles.employeeRight}`} style={{ width: 'calc(100% - 300px)' }}>
          <WardMonitoringPanel
            selectedWard={selectedWard}
            mapRef={mapRef}
            dutySummary={dutySummary}
            dutyLoading={dutyLoading}
            wardBoundaryGeoJsonData={wardBoundaryGeoJsonData}
            boundryLoading={boundryLoading}
            wardLineGeoJsonData={wardLineGeoJsonData}
            mapLoaded={mapLoaded}
            setMapLoaded={setMapLoaded}
            hasPositioned={hasPositioned}
            setHasPositioned={setHasPositioned}
          />
        </div>
      </div>
    </>
  );
};

export default Monitoring;
