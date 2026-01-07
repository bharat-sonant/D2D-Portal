import { useState, useEffect } from 'react';
import { images } from '../../assets/css/imagePath';
import style from '../../assets/css/User/UserCityAccess.module.css';
import * as userAction from '../../Actions/UserAction/UserAction';

const UserCityAccess = (props) => {
    console.log('props',props)
    const [selectedCities, setSelectedCities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.selectedUser?.id) {
            userAction.handleGetCity(props.selectedUser.id, setSelectedCities);
        } else {
            setSelectedCities([]);
        }
    }, [props.selectedUser?.id]);

    const handleCheckboxChange = async (city_id) => {
        if (!props.selectedUser?.id) {
            return;
        }
        const isCurrentlySelected = selectedCities.some(
            c => c.city_id === city_id
        );

        await userAction.handleCityAccessToggle(props.selectedUser?.id, city_id, isCurrentlySelected, setSelectedCities, setLoading, selectedCities);
    };

    return (
        <div className={style.Detailscard}>
            <div className={style.card_header}>
                <h5 className={style.heading}>User City Access</h5>
            </div>

            <div className={style.Scroll_List}>
                {!props.selectedUser ? (
                    <div className={style.dropdownItemNot}>
                        <img
                            src={images.imgComingSoon}
                            className={`${style.foundNot}`}
                            alt="No user selected"
                        />
                        Please select a user to manage city access.
                    </div>
                ) : props.cityList && props.cityList.length > 0 ? (
                    <ul className={style.listLine}>
                        {props.cityList.map((item, index) => (
                            <li key={index} className={style.list_item}>
                                <span className={style.designationName}>
                                    {item.city_name}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={selectedCities.some(c => c.city_id === item.city_id)}
                                    className={style.checkbox}
                                    onChange={() => handleCheckboxChange(item.city_id)}
                                    disabled={loading}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={style.dropdownItemNot}>
                        <img
                            src={images.imgComingSoon}
                            className={`${style.foundNot}`}
                            alt="No cities"
                        />
                        No city found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCityAccess;