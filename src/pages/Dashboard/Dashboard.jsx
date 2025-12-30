import style from "../../assets/css/Dashboard/Dashboard.module.css";
import WelcomeMsg from "../../components/Dashboard/WelcomeMsg";

const Dashboard = () => {
  return (
    <>
      <div className={`${style.dashboardPage}`}>
        <div className={`${style.dashboardLeft}`}>
          <WelcomeMsg />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3"></div>
      </div>
      <div className={style.birthdayContainer}></div>
    </>
  );
};

export default Dashboard;
