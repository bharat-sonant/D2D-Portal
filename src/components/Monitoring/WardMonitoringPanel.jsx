import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import { Settings, SquareKanban, Star, ClipboardList, Clock, TrendingUp, CalendarDays, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import WevoisLoader from "../Common/Loader/WevoisLoader";
import styles from "../../assets/css/City/CityList.module.css";
import monStyles from "./WardMonitoring.module.css";
import { images } from "../../assets/css/imagePath";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, Polygon, Polyline } from "@react-google-maps/api";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const WardMonitoringPanel = ({
  selectedWard,
  mapRef,
  dutySummary,
  dutyLoading,
  wardBoundaryGeoJsonData,
  boundryLoading,
  wardLineGeoJsonData,
  mapLoaded,
  setMapLoaded,
  hasPositioned,
  setHasPositioned
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showSettings, setShowSettings] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const [settings, setSettings] = useState({
    showLineNo: false,
    showAllDustbin: false,
    showWorkerDetail: false,
    showWorkDetail: false,
    showNearByWards: false,
    showTrackRoute: false,
    showLineDetails: true,
    showLineSummary: true,
    showHouses: false,
    hideVTSRoutes: false
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fallbackCenter = { lat: 26.9124, lng: 75.7873 };
  const fallbackZoom = 13;

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || hasPositioned || boundryLoading) return;

    if (wardBoundaryGeoJsonData?.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      wardBoundaryGeoJsonData.forEach(p => bounds.extend(p));
      mapRef.current.fitBounds(bounds);
      setHasPositioned(true);
      return;
    }

    mapRef.current.setCenter(fallbackCenter);
    mapRef.current.setZoom(13);
    setHasPositioned(true);
  }, [mapLoaded, wardBoundaryGeoJsonData, hasPositioned]);

  const dateStrip = [];
  for (let i = 0; i <= 6; i++) {
    dateStrip.push(dayjs().subtract(i, 'day'));
  }



  if (dutyLoading || boundryLoading) {
    return <WevoisLoader title="Fetching monitoring data..." />;
  }

  return (
    <div className={monStyles.monitoringContainer}>
      {/* 🟢 TOP HEADER ROW */}
      <div className={monStyles.topHeader}>
        <div className={monStyles.dateStrip}>
          {dateStrip.map((d) => {
            const isToday = d.isSame(dayjs(), 'day');
            const isActive = selectedDate === d.format('YYYY-MM-DD');
            return (
              <div
                key={d.format('YYYY-MM-DD')}
                className={`${monStyles.dateItem} ${isActive ? monStyles.active : ''}`}
                onClick={() => setSelectedDate(d.format('YYYY-MM-DD'))}
              >
                <span className={monStyles.dayLabel}>{d.format('ddd')}</span>
                <span className={monStyles.dateLabel}>{isToday ? "Today" : d.format('DD MMM')}</span>
              </div>
            );
          })}

          {/* MUI DATE PICKER TRIGGER */}
          <div className={monStyles.customDateContainer} ref={datePickerRef}>
            <div
              className={monStyles.customDateDisplay}
              onClick={() => setOpenDatePicker(true)}
            >
              <span
                className={monStyles.customDateText}
                style={{
                  color: !dateStrip.some(d => d.format('YYYY-MM-DD') === selectedDate) ? '#3fb2f1' : '#64748b'
                }}
              >
                {dateStrip.some(d => d.format('YYYY-MM-DD') === selectedDate)
                  ? "Custom Date"
                  : dayjs(selectedDate).format('DD MMM YYYY')}
              </span>
              <CalendarDays className={monStyles.customDateIcon} style={{color:!dateStrip.some(d => d.format('YYYY-MM-DD') === selectedDate)?"#3fb2f1":"#64748b"}} size={18} />
            </div>

            <div className={monStyles.muiDatePickerHidden}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={new Date(selectedDate)}
                  open={openDatePicker}
                  onOpen={() => setOpenDatePicker(true)}
                  onClose={() => setOpenDatePicker(false)}
                  enableAccessibleFieldDOMStructure={false}
                  maxDate={new Date()}
                  onChange={(newDate) => {
                    if (newDate) {
                      setSelectedDate(dayjs(newDate).format("YYYY-MM-DD"));
                      setOpenDatePicker(false);
                    }
                  }}
                  slots={{
                    textField: TextField,
                  }}
                  slotProps={{
                    textField: {
                      style: { display: 'none' },
                    },
                    popper: {
                      anchorEl: datePickerRef.current,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <div className={monStyles.settingsBox} onClick={() => setShowSettings(true)}>
          <Settings className={monStyles.settingsIcon} />
        </div>
      </div>

      {/* 🟢 MAIN BODY SECTION */}
      <div className={monStyles.mainBody}>
        {/* LEFT PART: MAP */}
        <div className={monStyles.mapSection}>
          <GoogleMap
            key={selectedWard?.id}
            defaultCenter={fallbackCenter}
            defaultZoom={fallbackZoom}
            onLoad={(map) => {
              mapRef.current = map;
              setHasPositioned(false);
              setMapLoaded(true);
            }}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {wardBoundaryGeoJsonData?.length > 0 && (
              <Polygon
                paths={wardBoundaryGeoJsonData}
                options={{
                  strokeColor: "#3b82f6",
                  strokeWeight: 2,
                  strokeOpacity: 0.8,
                  fillOpacity: 0.05,
                  fillColor: "#3b82f6"
                }}
              />
            )}

            {wardLineGeoJsonData?.map((path, index) => (
              <Polyline
                key={index}
                path={path}
                options={{
                  strokeColor: "#1e293b",
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                }}
              />
            ))}
          </GoogleMap>
        </div>

        {/* RIGHT PART: DETAILS */}
        <div className={monStyles.detailsSection}>
          <div className={monStyles.sectionTitle}>
            <ClipboardList color='#3fb2f1' size={20} /> Ward Status
          </div>

          <div className={monStyles.metricsGrid}>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}># Duty On</span>
              <span className={monStyles.metricValue}>{dutySummary?.duty_on_time || "N/A"}</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}># Reach On</span>
              <span className={monStyles.metricValue}>{dutySummary?.ward_reach_time || "N/A"}</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>App Status</span>
              <span className={monStyles.metricValue}>Opened</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Trip</span>
              <span className={monStyles.metricValue}>0</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Vehicle Status</span>
              <span className={monStyles.metricValue}>Ward In</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}># Duty Off</span>
              <span className={monStyles.metricValue}>{dutySummary?.duty_off_time || "Pending"}</span>
            </div>
          </div>

          <div className={monStyles.secondaryStats}>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Total Lines</span>
              <span className={monStyles.metricValue}>40</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Total Halt</span>
              <span className={monStyles.metricValue}>0:44</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Completed</span>
              <span className={monStyles.metricValue}>13</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Curr Halt</span>
              <span className={monStyles.metricValue}>0:16</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Skipped</span>
              <span className={monStyles.metricValue}>0</span>
            </div>

            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Curr Line</span>
              <span className={monStyles.metricValue}>14</span>
            </div>
          </div>

          <div className={monStyles.sectionTitle} style={{ marginTop: '20px' }}>
            <TrendingUp color='#3fb2f1' size={20} /> Distance & Time
          </div>
          <div className={monStyles.metricsGrid}>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Time (Total)</span>
              <span className={monStyles.metricValue}>2 hr 50 min</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Time (In Zone)</span>
              <span className={monStyles.metricValue}>1 hr 40 min</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Km Runs (Total)</span>
              <span className={monStyles.metricValue}>13.22 km</span>
            </div>
            <div className={monStyles.metricCard}>
              <span className={monStyles.metricLabel}>Km Runs (In Zone)</span>
              <span className={monStyles.metricValue}>1.29 Km</span>
            </div>
          </div>

          <div className={monStyles.sectionTitle} style={{ marginTop: '20px' }}>
            <SquareKanban color='#3fb2f1' size={20} /> Worker Details
          </div>

          <div className={monStyles.staffContainer}>
            <div className={`${monStyles.metricCard} ${monStyles.vehicleInfoCard}`}>
              <span className={monStyles.metricLabel}>Vehicle Info</span>
              <span className={monStyles.metricValue}>Vehicle Number - TATA-CNG-1652</span>
            </div>

            <div className={monStyles.staffCard}>
              <img src={images.imgUser} className={monStyles.staffImg} alt="Driver" />
              <div className={monStyles.staffInfo}>
                <span className={monStyles.staffName}>{dutySummary?.driver_name || "Driver Name"}</span>
                <span className={monStyles.staffContact}>+91 9876543210 • BR01AB1234</span>
                <div className={monStyles.ratingBox}>
                  <Star className={monStyles.star} size={14} fill="currentColor" />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>4.5</span>
                </div>
              </div>
            </div>

            <div className={monStyles.staffCard}>
              <img src={images.imgUser} className={monStyles.staffImg} alt="Helper" />
              <div className={monStyles.staffInfo}>
                <span className={monStyles.staffName}>{dutySummary?.helper_name || "Helper Name"}</span>
                <span className={monStyles.staffContact}>+91 9123456789 • 2nd Helper N/A</span>
                <div className={monStyles.ratingBox}>
                  <Star className={monStyles.star} size={14} fill="currentColor" />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>4.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 SETTINGS SLIDER */}
      {showSettings && (
        <div className={monStyles.sliderOverlay} onClick={() => setShowSettings(false)} />
      )}
      <div className={`${monStyles.settingsSlider} ${showSettings ? monStyles.open : ''}`}>
        <div className={monStyles.sliderHeader}>
          <span className={monStyles.sliderTitle}>Map Settings</span>
          <span className={monStyles.closeBtn} onClick={() => setShowSettings(false)}>×</span>
        </div>
        <div className={monStyles.sliderBody}>
          {[
            { label: 'Show Line No', key: 'showLineNo' },
            { label: 'Show All Dustbin', key: 'showAllDustbin' },
            { label: 'Show Worker Detail', key: 'showWorkerDetail' },
            { label: 'Show Work Detail', key: 'showWorkDetail' },
            { label: 'Show Near By Wards', key: 'showNearByWards' },
            { label: 'Show Track Route', key: 'showTrackRoute' },
            { label: 'Show Houses', key: 'showHouses' },
            { label: 'Hide VTS Routes', key: 'hideVTSRoutes' },
          ].map(opt => (
            <div key={opt.key} className={monStyles.optionRow} onClick={() => toggleSetting(opt.key)}>
              <span className={monStyles.optionText}>{opt.label}</span>
              <div className={`${monStyles.checkbox} ${settings[opt.key] ? monStyles.checked : ''}`}>
                {settings[opt.key] && <span className={monStyles.checkIcon}>✓</span>}
              </div>
            </div>
          ))}

          {[
            { label: 'Show Line Details', key: 'showLineDetails' },
            { label: 'Show Line Summary', key: 'showLineSummary' },
          ].map(opt => (
            <div key={opt.key} className={monStyles.optionRow} onClick={() => toggleSetting(opt.key)}>
              <span className={monStyles.optionText}>{opt.label}</span>
              <div className={monStyles.eyeIcon}>
                {settings[opt.key] ? (
                  <Eye className={`${monStyles.eyeIconLucide} ${monStyles.active}`} size={20} />
                ) : (
                  <EyeOff className={`${monStyles.eyeIconLucide} ${monStyles.inactive}`} size={20} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardMonitoringPanel;
