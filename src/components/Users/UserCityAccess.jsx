import { images } from '../../assets/css/imagePath';
import style from '../../assets/css/User/UserCityAccess.module.css';

const UserCityAccess = (props) => {
    return (
        <div className={style.Detailscard}>
            <div className={style.card_header}>
                <h5 className={style.heading}> User City Access.</h5>
            </div>

            <div className={style.Scroll_List}>
                {props.cityList && props.cityList.length > 0 ? (
                    <ul className={style.listLine}>
                        {props.cityList.map((item, index) => (
                            <li key={index} className={style.list_item}>
                                <span className={style.designationName}>
                                    {" "}
                                    {item.CityName}
                                </span>
                                <input
                                    type="checkbox"
                                    value={item.CityName}
                                    className={style.checkbox}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={style.dropdownItemNot}>
                        <img src={images.imgComingSoon} className={`${style.foundNot}`} />
                        No city found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCityAccess;