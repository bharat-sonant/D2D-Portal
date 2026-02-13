import { useEffect, useRef, useState } from 'react';
import GlobalStyles from "../../assets/css/globleStyles.module.css";
import TaskStyles from "../../MobileAppPages/Tasks/Styles/TaskList/TaskList.module.css";
import WardList from '../../components/Monitoring/WardList';
import { getWardListAction } from '../../Actions/Monitoring/wardListSectionAction';
import { getWardDashboardDataAction } from '../../Actions/Monitoring/wardDashboardSectionAction';
import { useCity } from '../../context/CityContext';
import WardMonitoringPanel from '../../components/Monitoring/WardMonitoringPanel';
import WevoisLoader from '../../components/Common/Loader/WevoisLoader';
import dayjs from 'dayjs';
import { ChevronUp, ChevronDown } from 'lucide-react';
import monStyles from '../../components/Monitoring/WardMonitoring.module.css';

const Monitoring = () => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardList, setWardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cityId } = useCity();
  const [dutySummary, setDutySummary] = useState(null);
  const [dutyLoading, setDutyLoading] = useState(false);
  const date = dayjs().format('YYYY-MM-DD');
  const mapRef = useRef(null);
  const [wardBoundaryGeoJsonData, setWardBoundaryGeoJsonData] = useState(null);
  const [wardLineGeoJsonData, setWardLineGeoJsonData] = useState(null);
  const [boundryLoading, setBoundryLoading] = useState(false);
  const [hasPositioned, setHasPositioned] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showZoneSummary, setShowZoneSummary] = useState(false);
  const [isWardSwitchLoading, setIsWardSwitchLoading] = useState(false);
  const [hasDashboardResponse, setHasDashboardResponse] = useState(false);
  const requestIdRef = useRef(0);

  const resetMapState = () => {
    setHasPositioned(false);
    setMapLoaded(false);
    if (mapRef.current) {
      mapRef.current = null;
    }
  };

  const fetchWardDashboard = async (ward) => {
    if (!ward || !cityId) return;

    const currentRequestId = ++requestIdRef.current;
    setIsWardSwitchLoading(true);
    setDutyLoading(true);
    setBoundryLoading(true);
    setHasDashboardResponse(false);
    setWardBoundaryGeoJsonData(null);
    setWardLineGeoJsonData(null);
    resetMapState();

    try {
      const result = await getWardDashboardDataAction({ date, ward, cityId });
      if (currentRequestId !== requestIdRef.current) return;

      setDutySummary(result.dutySummary || null);
      setWardBoundaryGeoJsonData(result.wardBoundaryGeoJsonData || null);
      setWardLineGeoJsonData(result.wardLineGeoJsonData || null);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setDutyLoading(false);
        setBoundryLoading(false);
        setHasDashboardResponse(true);
        setIsWardSwitchLoading(false);
      }
    }
  };

  const handleWardSelect = async (ward) => {
    if (!ward || isWardSwitchLoading) return;
    if (selectedWard?.id === ward.id) return;

    setSelectedWard(ward);
    await fetchWardDashboard(ward);
  };

  useEffect(() => {
    if (!cityId) return;

    let isMounted = true;

    const initializePage = async () => {
      setLoading(true);
      setSelectedWard(null);
      setWardList([]);
      setDutySummary(null);
      setWardBoundaryGeoJsonData(null);
      setWardLineGeoJsonData(null);
      setHasDashboardResponse(false);
      resetMapState();

      const response = await getWardListAction(cityId);
      if (!isMounted) return;

      setWardList(response.wardList);
      setSelectedWard(response.selectedWard);
      setLoading(false);

      if (response.selectedWard) {
        await fetchWardDashboard(response.selectedWard);
      }
    };

    initializePage();

    return () => {
      isMounted = false;
      requestIdRef.current += 1;
    };
  }, [cityId]);

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
              onWardSelect={handleWardSelect}
              loading={loading}
              interactionLocked={isWardSwitchLoading}
            />
          </div>
          {/* 🟢 ZONE PROGRESS SUMMARY */}
          <div className={monStyles.zoneSummaryContainer}>
            <div
              className={monStyles.zoneSummaryHeader}
              onClick={() => {
                if (isWardSwitchLoading) return;
                setShowZoneSummary(!showZoneSummary);
              }}
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
          {!selectedWard ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Ward not found</span>
            </div>
          ) : !hasDashboardResponse || dutyLoading || boundryLoading ? (
            <WevoisLoader title="Fetching monitoring data..." />
          ) : (
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
          )}
        </div>
      </div>
      {isWardSwitchLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'transparent',
            zIndex: 9999,
            pointerEvents: 'all',
          }}
        />
      )}
    </>
  );
};

export default Monitoring;
