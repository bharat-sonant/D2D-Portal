import { useEffect, useRef, useState } from "react";
import Styles from "../../../src/assets/css/modal.module.css";
import Style from '../../Style/LoginAs/LoginAs.module.css';
import globleStyle from '../../assets/css/globleStyles.module.css';
import { images } from '../../assets/css/imagePath';
import { GoArrowRight } from "react-icons/go";
import styles from "../../assets/css/Task/TaskDetails/Notify.module.css";

const CityModal = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCityKey, setSelectedCityKey] = useState(null);
    const [hoveredCityKey, setHoveredCityKey] = useState(null);
    const [showOtherCityModal, setShowOtherCityModal] = useState(false);
    const [otherCityName, setOtherCityName] = useState('');
    const [otherCityError, setOtherCityError] = useState('');
    const prevSelectedCityRef = useRef(null);

    const defaultExtraCities = [
        { cityName: 'Not in the list', Id: 'Not in the list', key: 'Not in the list' }
    ];

    const cityMap = new Map();
    [...props.citiesData, ...defaultExtraCities].forEach(city => {
        cityMap.set(city.key || city.Id, city);
    });
    const mergedCities = Array.from(cityMap.values());

    const filteredCities = mergedCities.filter(city =>
        city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const cityName = props.selectedCityName?.trim();
        if (!cityName) return;

        const lowerCity = cityName.toLowerCase();

        const matchInCities = props.citiesData?.find(
            city => city.cityName?.toLowerCase() === lowerCity
        );

        const matchInBDcity = props.BDcity?.find(
            city => city.cityName?.toLowerCase() === lowerCity
        );

        if (matchInCities || matchInBDcity) {
            setSelectedCityKey(matchInCities?.key || matchInBDcity?.key);
            setShowOtherCityModal(false);
        } else {
            setShowOtherCityModal(true);
            setOtherCityName(cityName);
        }

        prevSelectedCityRef.current = lowerCity;
    }, [props.selectedCityName, props.citiesData]);

    const cityGridStyle = {
        gap: '10px',
        overflow: 'auto',
        display: 'flex',
        flexWrap: 'wrap'
    };

    const cityButtonStyle = (cityKey, isSpecial = false) => {
        const isSelected = selectedCityKey === cityKey;
        const isHovered = hoveredCityKey === cityKey;

        let baseBg = '#f9f9f9';
        let baseBorder = '#ddd';
        let baseColor = '#666666';

        if (isSpecial) {
            baseBg = '#e9f6ff';
            baseBorder = '#3fb2f1';
            baseColor = '#007bff';
        }

        return {
            padding: '10px 10px',
            border: '1px solid',
            borderColor: isSelected ? '#3fb2f1' : isHovered ? '#3fb2f1' : baseBorder,
            borderRadius: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: isSelected
                ? '#e6f3ff'
                : isHovered
                    ? '#4094ddff'
                    : baseBg,
            color: isSelected
                ? '#007bff'
                : isHovered
                    ? '#ffffff'
                    : baseColor,
            fontWeight: isSpecial ? '600' : 'normal',
            transition: 'all 0.2s ease',
        };
    };

    const validateOtherCityName = (value) => {
        const trimmed = value.trim().toLowerCase();

        if (trimmed === '') {
            setOtherCityError('Please enter a city name.');
            return;
        }

        const cityExists = mergedCities.some(
            city => city.cityName.toLowerCase() === trimmed
        );

        if (cityExists) {
            setOtherCityError('This city is already part of the list. Please check again.');
        } else {
            setOtherCityError('');
        }
    };

    const handleOtherSubmit = () => {
        const trimmedCity = otherCityName.trim().toLowerCase();

        if (trimmedCity === '') {
            setOtherCityError('Please enter a city name.');
            return;
        }

        const cityExists = mergedCities.some(
            city => city.cityName.toLowerCase() === trimmedCity
        );

        if (cityExists) {
            setOtherCityError('This city is already part of the list. Please check again.');
            return;
        }

        props.onCitySelect?.({
            cityKey: 'Other',
            cityName: otherCityName.trim()
        });

        setSelectedCityKey('Other');
        setShowOtherCityModal(false);
        setOtherCityName('');
        setOtherCityError('');
    };

    return (
        <>
            <div className={Styles.overlay}>
                <div className={Styles.modal} style={{ width: '745px' }}>
                    <div className={Styles.actionBtn}>
                        <div>
                            <p className={Styles.headerText}>Select City</p>
                        </div>
                        <button
                            className={Styles.closeBtn}
                            onClick={() => props.setShowExpenseModal(false)}
                        >
                            <img src={images.iconClose} className={Styles.iconClose} alt="Close" />
                        </button>
                    </div>

                    <div className={`${styles.noteBox}`}>
                        <div className={`${styles.noteLeft}`}>
                            <img src={images.iconAlertWarning} className={`${styles.iconAlertWarning}`} title="Info" alt="icon" />
                        </div>
                        <p className={`${styles.boxContent}`}>
                            Please select the city where the expense was incurred for which you are requesting <span style={{ fontWeight: 'bold' }}> Reimbursement</span>.
                        </p>
                    </div>

                    <div className={`${Styles.modalBody} ${Style.modalBodyAs} mb-4`} style={{ padding: '0px 30px 0px 30px' }}>
                        <div className={Style.searchGroup}>
                            <input
                                className={globleStyle.inputSearch}
                                type="text"
                                placeholder="Search"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.selectCityScroll}>
                            <div style={cityGridStyle}>
                                {filteredCities.length === 0 ? (

                                    <div className="d-flex flex-column align-items-center justify-content-center " style={{ height: '400px', width: '100%' }}>
                                        <img src={images.noUser} className={styles.iconNo} />
                                        <p className={styles.textNo}>No city data found.</p>
                                    </div>


                                ) : (
                                    (() => {
                                        const citiesWithoutOther = filteredCities.filter(c => c.Id !== 'Not in the list');
                                        const others = filteredCities.find(c => c.Id === 'Not in the list');

                                        return (
                                            <>
                                                {citiesWithoutOther.map(city => (
                                                    <button
                                                        key={city.Id}
                                                        style={cityButtonStyle(city.key || city.Id)}
                                                        onClick={() => {
                                                            setSelectedCityKey(city.key || city.Id);
                                                            props.onCitySelect?.({
                                                                cityKey: city.key || city.Id,
                                                                cityName: city.cityName
                                                            });
                                                        }}
                                                        onMouseEnter={() => setHoveredCityKey(city.key || city.Id)}
                                                        onMouseLeave={() => setHoveredCityKey(null)}
                                                    >
                                                        {city.cityName}
                                                    </button>
                                                ))}

                                                {others && (
                                                    <button
                                                        key={others.Id}
                                                        style={cityButtonStyle(others.Id, true)}
                                                        onClick={() => setShowOtherCityModal(true)}
                                                        onMouseEnter={() => setHoveredCityKey(others.Id)}
                                                        onMouseLeave={() => setHoveredCityKey(null)}
                                                    >
                                                        {others.cityName}
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showOtherCityModal && (
                <div className={Styles.overlay}>
                    <div className={Styles.modal} style={{ width: '22%', height: '230px' }}>
                        <div className={Styles.actionBtn}>
                            <p className={Styles.headerText}></p>
                            <button
                                className={Styles.closeBtn}
                                onClick={() => {
                                    setShowOtherCityModal(false);
                                    setOtherCityName('');
                                    setOtherCityError('');
                                }}
                            >
                                <img src={images.iconClose} className={Styles.iconClose} alt="Close" />
                            </button>
                        </div>

                        <div className={`${Styles.modalBody} ${Style.modalBodyAs}`}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className={Styles.textboxGroup}>
                                        <div className={Styles.textboxMain}>
                                            <div className={Styles.textboxLeft}>City Name</div>
                                            <div className={Styles.textboxRight}>
                                                <input
                                                    type="text"
                                                    className={`form-control ${Styles.formTextbox}`}
                                                    placeholder="Enter city name"
                                                    value={otherCityName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setOtherCityName(value);
                                                        validateOtherCityName(value);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleOtherSubmit();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {otherCityError && (
                                            <p className={Styles.errorMessage}>{otherCityError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={Styles.btnSave}
                                style={{
                                    width: "86%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    fontSize: "16px",
                                    position: 'absolute',
                                    bottom: '22px',
                                    left: '24px'
                                }}
                                onClick={handleOtherSubmit}
                            >
                                Next
                                <GoArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CityModal;
