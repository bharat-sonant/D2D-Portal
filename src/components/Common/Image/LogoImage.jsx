import style from './image.module.css'
const LogoImage = (props) => {
  return (
    <div className={style.logo_container}>
      {props?.image && (
        <img
          src={props?.image|| "/city-placeholder.png"}
          alt="City Logo"
          className={style.logo_image}
        />
      )}
    </div>
  );
}

export default LogoImage