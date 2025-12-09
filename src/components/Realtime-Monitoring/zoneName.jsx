import style from "../../MobileAppPages/Settings/Style/Settings.module.css"


const ZoneName = ({name}) => {
  return (
    <div className={`${style.card}`} >
      <h6 style={{color:!name && 'lightgrey'}}>{name || "Not Selected Any"}</h6>
    </div>
  );
}

export default ZoneName;