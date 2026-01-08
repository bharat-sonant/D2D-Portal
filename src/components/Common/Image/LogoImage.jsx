import style from './image.module.css'
const LogoImage = (props) => {
  return (
    <div className={style.logo_container}>
      {props?.image && (
        <img
          src={props?.image || "/city-placeholder.png"}
          alt="City Logo"
          // className={style.city_logo_std}
        />
      )}
    </div>
  );
}

export default LogoImage