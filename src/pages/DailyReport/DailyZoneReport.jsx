import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { LayoutGrid, List } from "lucide-react";
import QuickDateSelection from "../../components/Common/QuickDateSelection/QuickDateSelection";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker";
import { images } from "../../assets/css/imagePath";
import style from "../../Style/Reports_Style/DailyWorkReport/DailyWorkReport.module.css";
import localStyles from "./DailyZoneReport.module.css";

const rows = [
  {
    ward: "Zone 1",
    dutyOn: "08:37",
    wardReach: "09:17",
    dutyOff: "19:14",
    workingHrs: "10:37",
    wardHaltDuration: "3:30 hr",
    vehicle: "LEY-AT-4602",
    driver: "SANWAR LAL (909)",
    helper: "DHARAMRAJ(C) (1346)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "70%",
    actualWorkPercentage: "37%",
    runKM: "39.130",
    zoneRunKM: "18.994",
    remark: "helper nhi hone k kaaran ward pura nhi ho paya",
  },
  {
    ward: "Zone 2",
    dutyOn: "06:12",
    wardReach: "06:53",
    dutyOff: "13:07",
    workingHrs: "6:55",
    wardHaltDuration: "0:25 hr",
    vehicle: "TATA-CNG-1560",
    driver: "AJAY KUMAR (1437)",
    helper: "RAGHUNANDAN (1778)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "100%",
    actualWorkPercentage: "100%",
    runKM: "49.988",
    zoneRunKM: "9.991",
    remark: "-",
  },
  {
    ward: "Zone 3",
    dutyOn: "13:26",
    wardReach: "13:30",
    dutyOff: "16:06",
    workingHrs: "2:40",
    wardHaltDuration: "0:11 hr",
    vehicle: "TATA-CNG-1824",
    driver: "SANDEEP KUMAR (1153)",
    helper: "AAKASH HARIJAN (1817)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "91%",
    actualWorkPercentage: "46%",
    runKM: "18.547",
    zoneRunKM: "7.311",
    remark: "second ward hone k kaaran ward pura nhi ho paya",
  },
  {
    ward: "Zone 4",
    dutyOn: "07:48",
    wardReach: "08:03",
    dutyOff: "12:45",
    workingHrs: "4:57",
    wardHaltDuration: "0:48 hr",
    vehicle: "TATA-CNG-5404",
    driver: "RAVI KUMAR JOJOTAR (524)",
    helper: "VIKAS KUMAR (1990)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "100%",
    actualWorkPercentage: "100%",
    runKM: "26.516",
    zoneRunKM: "5.056",
    remark: "-",
  },
  {
    ward: "Zone 5",
    dutyOn: "09:12",
    wardReach: "09:36",
    dutyOff: "13:51",
    workingHrs: "4:39",
    wardHaltDuration: "0:29 hr",
    vehicle: "TATA-AT-5520",
    driver: "MOHAMMED GAFFAR (380)",
    helper: "VIJAY KUMAR (1993)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "97%",
    actualWorkPercentage: "97%",
    runKM: "17.785",
    zoneRunKM: "4.184",
    remark: "-",
  },
  {
    ward: "Zone 6",
    dutyOn: "14:05",
    wardReach: "14:05",
    dutyOff: "17:59",
    workingHrs: "3:54",
    wardHaltDuration: "0:38 hr",
    vehicle: "TATA-AT-WeV-5829",
    driver: "RAJENDRA PRASAD (373)",
    helper: "MANJEET SINGH (1438)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "90%",
    actualWorkPercentage: "45%",
    runKM: "23.037",
    zoneRunKM: "3.657",
    remark: "second ward hone k kaaran ward pura nhi ho paya",
  },
  {
    ward: "Zone 7",
    dutyOn: "07:22",
    wardReach: "07:41",
    dutyOff: "13:58",
    workingHrs: "6:36",
    wardHaltDuration: "0:41 hr",
    vehicle: "TATA-CNG-6612",
    driver: "RAMESH KUMAR (701)",
    helper: "SONU SHARMA (1551)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "96%",
    actualWorkPercentage: "88%",
    runKM: "31.205",
    zoneRunKM: "8.221",
    remark: "-",
  },
  {
    ward: "Zone 8",
    dutyOn: "08:04",
    wardReach: "08:25",
    dutyOff: "15:21",
    workingHrs: "7:17",
    wardHaltDuration: "0:34 hr",
    vehicle: "LEY-AT-4781",
    driver: "MUKESH JAT (842)",
    helper: "GANESH MEENA (1662)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "93%",
    actualWorkPercentage: "74%",
    runKM: "28.640",
    zoneRunKM: "6.804",
    remark: "traffic delay",
  },
  {
    ward: "Zone 9",
    dutyOn: "06:45",
    wardReach: "07:05",
    dutyOff: "12:59",
    workingHrs: "6:14",
    wardHaltDuration: "0:18 hr",
    vehicle: "TATA-AT-5710",
    driver: "HEMANT SINGH (911)",
    helper: "DINESH KUMAR (1798)",
    secondHelper: "-",
    tripCount: "3",
    workPercentage: "100%",
    actualWorkPercentage: "97%",
    runKM: "36.922",
    zoneRunKM: "10.331",
    remark: "-",
  },
  {
    ward: "Zone 10",
    dutyOn: "09:10",
    wardReach: "09:36",
    dutyOff: "14:52",
    workingHrs: "5:42",
    wardHaltDuration: "0:52 hr",
    vehicle: "TATA-CNG-4907",
    driver: "PRADEEP YADAV (1041)",
    helper: "RAKESH JANGID (1886)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "84%",
    actualWorkPercentage: "63%",
    runKM: "19.287",
    zoneRunKM: "5.014",
    remark: "bin overflow at two points",
  },
  {
    ward: "Zone 11",
    dutyOn: "07:38",
    wardReach: "07:56",
    dutyOff: "13:41",
    workingHrs: "6:03",
    wardHaltDuration: "0:27 hr",
    vehicle: "LEY-AT-4399",
    driver: "MAHESH CHOUDHARY (1120)",
    helper: "RAVI VERMA (1910)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "92%",
    actualWorkPercentage: "86%",
    runKM: "27.118",
    zoneRunKM: "7.220",
    remark: "-",
  },
  {
    ward: "Zone 12",
    dutyOn: "08:20",
    wardReach: "08:42",
    dutyOff: "16:04",
    workingHrs: "7:44",
    wardHaltDuration: "0:36 hr",
    vehicle: "TATA-CNG-6102",
    driver: "NARESH KUMAR (1234)",
    helper: "AKSHAY JAIN (2012)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "95%",
    actualWorkPercentage: "90%",
    runKM: "33.741",
    zoneRunKM: "9.612",
    remark: "-",
  },
  {
    ward: "Zone 13",
    dutyOn: "06:58",
    wardReach: "07:11",
    dutyOff: "12:50",
    workingHrs: "5:52",
    wardHaltDuration: "0:22 hr",
    vehicle: "TATA-AT-5933",
    driver: "AMIT JOSHI (1311)",
    helper: "LALIT SHARMA (2098)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "88%",
    actualWorkPercentage: "71%",
    runKM: "22.306",
    zoneRunKM: "6.109",
    remark: "narrow lane blockage",
  },
  {
    ward: "Zone 14",
    dutyOn: "10:02",
    wardReach: "10:21",
    dutyOff: "15:33",
    workingHrs: "5:31",
    wardHaltDuration: "0:44 hr",
    vehicle: "LEY-AT-4870",
    driver: "SURESH MEENA (1402)",
    helper: "PANKAJ SINGH (2147)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "79%",
    actualWorkPercentage: "58%",
    runKM: "16.992",
    zoneRunKM: "4.321",
    remark: "late duty start",
  },
  {
    ward: "Zone 15",
    dutyOn: "07:10",
    wardReach: "07:30",
    dutyOff: "14:06",
    workingHrs: "6:56",
    wardHaltDuration: "0:30 hr",
    vehicle: "TATA-CNG-6221",
    driver: "JITENDRA PAL (1508)",
    helper: "ROHIT SETHI (2206)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "98%",
    actualWorkPercentage: "94%",
    runKM: "34.140",
    zoneRunKM: "9.880",
    remark: "-",
  },
  {
    ward: "Zone 16",
    dutyOn: "08:47",
    wardReach: "09:02",
    dutyOff: "14:44",
    workingHrs: "5:57",
    wardHaltDuration: "0:39 hr",
    vehicle: "TATA-AT-6033",
    driver: "ANIL KUMAR (1620)",
    helper: "KAPIL GUPTA (2314)",
    secondHelper: "-",
    tripCount: "2",
    workPercentage: "90%",
    actualWorkPercentage: "76%",
    runKM: "24.752",
    zoneRunKM: "6.477",
    remark: "-",
  },
  {
    ward: "Zone 17",
    dutyOn: "06:35",
    wardReach: "06:52",
    dutyOff: "12:41",
    workingHrs: "6:06",
    wardHaltDuration: "0:20 hr",
    vehicle: "LEY-AT-5122",
    driver: "VIKRAM CHAUDHARY (1704)",
    helper: "ARUN KHANDELWAL (2391)",
    secondHelper: "-",
    tripCount: "3",
    workPercentage: "100%",
    actualWorkPercentage: "98%",
    runKM: "41.236",
    zoneRunKM: "11.205",
    remark: "-",
  },
  {
    ward: "Zone 18",
    dutyOn: "09:28",
    wardReach: "09:49",
    dutyOff: "15:02",
    workingHrs: "5:34",
    wardHaltDuration: "0:33 hr",
    vehicle: "TATA-CNG-6440",
    driver: "NITIN SHARMA (1812)",
    helper: "PRAVEEN SINGH (2460)",
    secondHelper: "-",
    tripCount: "1",
    workPercentage: "86%",
    actualWorkPercentage: "62%",
    runKM: "18.930",
    zoneRunKM: "4.998",
    remark: "route deviation due to blockage",
  },
];

const DailyZoneReport = () => {
  const todayDate = dayjs().format("YYYY-MM-DD");
  const [date, setDate] = useState(todayDate);
  const [viewMode, setViewMode] = useState("list");
  const [hideTopBar, setHideTopBar] = useState(false);
  const tableRef = useRef(null);
  const headCase = { textTransform: "capitalize" };
  const parsePercent = (val) => {
    const num = Number(String(val).replace("%", "").trim());
    if (Number.isNaN(num)) return 0;
    return Math.max(0, Math.min(100, num));
  };
  const getToneClass = (value) => {
    if (value >= 90) return localStyles.toneGood;
    if (value >= 70) return localStyles.toneWarn;
    return localStyles.toneRisk;
  };
  const toTitleCase = (text) =>
    String(text || "-")
      .toLowerCase()
      .replace(/\b\w/g, (ch) => ch.toUpperCase());

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const HIDE_THRESHOLD = 100;
    const SHOW_THRESHOLD = 40;

    const handleTableScroll = () => {
      const scrollTop = el.scrollTop;

      if (scrollTop > HIDE_THRESHOLD && !hideTopBar) {
        setHideTopBar(true);
      }

      if (scrollTop < SHOW_THRESHOLD && hideTopBar) {
        setHideTopBar(false);
      }
    };

    el.addEventListener("scroll", handleTableScroll);
    return () => el.removeEventListener("scroll", handleTableScroll);
  }, [hideTopBar]);

  return (
    <>
      <div
        className={`${style.topBar} ${localStyles.topBar} ${hideTopBar ? style.hideTopBar : ""}`}
      >
        <div className={style.leftSection}>
          <QuickDateSelection value={date} onChange={(val) => setDate(val)} />
        </div>
        <CustomDatePicker value={date} onChange={(val) => setDate(val)} />

        <div className={style.rightButtons}>
          <div className={localStyles.viewSwitch}>
            <button
              type="button"
              className={`${localStyles.viewBtn} ${viewMode === "list" ? localStyles.viewBtnActive : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={14} />
              List
            </button>
            <button
              type="button"
              className={`${localStyles.viewBtn} ${viewMode === "grid" ? localStyles.viewBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
          </div>
          <button className={style.exportBtn}>
            <img
              src={images.iconExcel}
              className={style.iconExcel}
              title="Export to Excel"
              alt="Export to Excel"
            />
            <div>Export to Excel</div>
          </button>
        </div>
      </div>

      <div
        ref={tableRef}
        className={`${style.tableContainer} ${localStyles.tableContainer} ${hideTopBar ? style.tableContainerFull : ""}`}
      >
        {viewMode === "list" ? (
          <table
            className={`${style.table} ${localStyles.table}`}
            style={{ width: "max-content", minWidth: "1710px", tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "155px" }} />
              <col style={{ width: "85px" }} />
              <col style={{ width: "105px" }} />
              <col style={{ width: "85px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "125px" }} />
              <col style={{ width: "135px" }} />
              <col style={{ width: "225px" }} />
              <col style={{ width: "210px" }} />
              <col style={{ width: "165px" }} />
              <col style={{ width: "95px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "270px" }} />
            </colgroup>
            <thead>
              <tr>
                <th
                  className={`${style.parentHeader} ${style.parentHeader1}`}
                  style={headCase}
                >
                  Zone
                </th>
                <th className={style.parentHeader} colSpan={5} style={headCase}>
                  Timing Details
                </th>
                <th className={style.parentHeader} colSpan={4} style={headCase}>
                  Person / Vehicle Details
                </th>
                <th className={style.parentHeader} colSpan={5} style={headCase}>
                  Performance Details
                </th>
                <th className={style.parentHeader} style={headCase}></th>
              </tr>
              <tr>
                <th
                  className={`${style.th1} ${style.parentHeader1} ${style.borderRight}`}
                  style={headCase}
                >
                  Ward
                </th>
                <th className={style.th2} style={headCase}>Duty On</th>
                <th className={style.th3} style={headCase}>Ward Reach</th>
                <th className={style.th4} style={headCase}>Duty Off</th>
                <th className={style.th4} style={headCase}>Working Hrs</th>
                <th className={`${style.th4} ${style.borderRight}`} style={headCase}>
                  Ward Halt Duration
                </th>
                <th className={style.th5} style={headCase}>Vehicle</th>
                <th className={style.th6} style={headCase}>Driver</th>
                <th className={style.th7} style={headCase}>Helper</th>
                <th className={`${style.th8} ${style.borderRight}`} style={headCase}>
                  Second Helper
                </th>
                <th className={style.th3} style={headCase}>Trip Count</th>
                <th className={style.th3} style={headCase}>Work %</th>
                <th className={style.th3} style={headCase}>Actual Work %</th>
                <th className={style.th3} style={headCase}>Run KM</th>
                <th className={`${style.th3} ${style.borderRight}`} style={headCase}>
                  Zone Run KM
                </th>
                <th className={style.th3} style={headCase}>Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.ward}-${index}`}>
                  <td className={`${style.th1} ${style.borderRight}`}>{row.ward}</td>
                  <td className={style.th2}>{row.dutyOn}</td>
                  <td className={style.th3}>{row.wardReach}</td>
                  <td className={style.th4}>{row.dutyOff}</td>
                  <td className={style.th4}>{row.workingHrs}</td>
                  <td className={`${style.th4} ${style.borderRight}`}>
                    {row.wardHaltDuration}
                  </td>
                  <td className={style.th5}><div className={style.vehicleNumber}>{row.vehicle}</div></td>
                  <td className={style.th6}>{toTitleCase(row.driver)}</td>
                  <td className={style.th7}>{toTitleCase(row.helper)}</td>
                  <td className={`${style.th8} ${style.borderRight}`}>
                    {toTitleCase(row.secondHelper)}
                  </td>
                  <td className={`text-center ${style.th3}`}><div className={style.tripBG}>{row.tripCount}</div></td>
                  <td className={`text-end ${style.th3}`}>
                    <div className={localStyles.pieWrap}>
                      <div
                        className={`${localStyles.pieProgress} ${localStyles.piePrimary}`}
                        style={{ "--p": parsePercent(row.workPercentage) }}
                      >
                        <span>{row.workPercentage}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`text-end ${style.th3}`}>
                    <div className={localStyles.pieWrap}>
                      <div
                        className={`${localStyles.pieProgress} ${localStyles.pieAlt}`}
                        style={{ "--p": parsePercent(row.actualWorkPercentage) }}
                      >
                        <span>{row.actualWorkPercentage}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`text-end ${style.th3}`}>{row.runKM}</td>
                  <td className={`text-end ${style.th3} ${style.borderRight}`}>
                    {row.zoneRunKM}
                  </td>
                  <td className={style.remark}>{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={localStyles.gridViewWrap}>
            {rows.map((row, index) => {
              const workVal = parsePercent(row.workPercentage);
              const actualVal = parsePercent(row.actualWorkPercentage);
              return (
                <article
                  key={`${row.ward}-${index}`}
                  className={`${localStyles.zoneCard} ${getToneClass(actualVal)}`}
                >
                  <div className={localStyles.zoneCardHead}>
                    <div className={localStyles.zoneCardTitleWrap}>
                      <h4>{row.ward}</h4>
                      <div className={localStyles.metaChips}>
                        <span className={localStyles.vehicleChip}>{row.vehicle}</span>
                        <span className={localStyles.dutyChip}>Duty On {row.dutyOn}</span>
                      </div>
                    </div>
                    <div className={localStyles.tripWrap}>
                      <div className={style.tripBG}>{row.tripCount}</div>
                      <span>Trips</span>
                    </div>
                  </div>

                  <div className={localStyles.kpiRow}>
                    <div className={localStyles.kpiItem}>
                      <div
                        className={`${localStyles.pieProgress} ${localStyles.piePrimary}`}
                        style={{ "--p": workVal }}
                      >
                        <span>{row.workPercentage}</span>
                      </div>
                      <label>Work %</label>
                    </div>

                    <div className={localStyles.kpiItem}>
                      <div
                        className={`${localStyles.pieProgress} ${localStyles.pieAlt}`}
                        style={{ "--p": actualVal }}
                      >
                        <span>{row.actualWorkPercentage}</span>
                      </div>
                      <label>Actual Work %</label>
                    </div>

                    <div className={localStyles.kmItem}>
                      <label>Run KM</label>
                      <strong>{row.runKM}</strong>
                    </div>

                    <div className={localStyles.kmItem}>
                      <label>Zone Run KM</label>
                      <strong>{row.zoneRunKM}</strong>
                    </div>
                  </div>

                  <div className={localStyles.timeStrip}>
                    <div className={localStyles.timeCell}><label>Ward Reach</label><span>{row.wardReach}</span></div>
                    <div className={localStyles.timeCell}><label>Duty Off</label><span>{row.dutyOff}</span></div>
                    <div className={localStyles.timeCell}><label>Working</label><span>{row.workingHrs}</span></div>
                    <div className={localStyles.timeCell}><label>Ward Halt</label><span>{row.wardHaltDuration}</span></div>
                  </div>

                  <div className={localStyles.personWrap}>
                    <div className={localStyles.personItem}>
                      <label>Driver</label>
                      <p>{toTitleCase(row.driver)}</p>
                    </div>
                    <div className={localStyles.personItem}>
                      <label>Helper</label>
                      <p>{toTitleCase(row.helper)}</p>
                    </div>
                    <div className={localStyles.personItem}>
                      <label>Second Helper</label>
                      <p>{toTitleCase(row.secondHelper)}</p>
                    </div>
                  </div>

                  <div className={localStyles.zoneCardRemark}>
                    <label>Remark</label>
                    <p>{row.remark}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default DailyZoneReport;
