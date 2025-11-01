import React, { useState, useEffect, useRef } from "react";
import style from "../../assets/css/Dashboard/Birthday.module.css";
import dayjs from "dayjs";
import { getBirthdayList } from "../../actions/Birthday/BirthdayAction";
import { images } from "../../assets/css/imagePath";

const Birthday2 = () => {
  const [birthdayList, setBirthdayList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    getBirthdayList(setBirthdayList, filterAndSortBirthdays);
  }, []);

  const filterAndSortBirthdays = (data) => {
    const today = dayjs().format("DD-MMM");
    const tomorrow = dayjs().add(1, "days").format("DD-MMM");
    const filteredData = data.filter((person) => {
      const dob = dayjs(person.dob).format("DD-MMM");
      return dob === today || dob === tomorrow;
    });
    return filteredData.sort((a, b) => {
      const dobA = dayjs(a.dob).format("DD-MMM");
      const dobB = dayjs(b.dob).format("DD-MMM");
      if (dobA === today && dobB !== today) return -1;
      if (dobB === today && dobA !== today) return 1;
      return 0;
    });
  };

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, birthdayList.length - 1)
    );
  };

  return (
    <>
      <div className={style.birthdayWrapper}>
        <div className={style.cardContainer} ref={scrollContainerRef}>
          {birthdayList.length > 0 ? (
            <div className={style.card}>
              <div class={`${style.particle}`}>🎂</div>
              <div class={`${style.particle}`}> 🎂</div>
              {/* <div class={`${style.particle}`}>🎁🎈</div>
              <div class={`${style.particle}`}>🥳</div> */}

              {/* <div className={style.topSection}></div> */}
              {currentIndex > 0 && (
                <button onClick={scrollLeft} className={`btn ${style.PrevBtn}`}>
                  <img src={images.iconUp} className={`${style.Icon}`} />
                </button>
              )}
              <div className={style.profileContainer}>
                <img
                  src={birthdayList[currentIndex].image || images.DeafultImg}
                  className={
                    birthdayList[currentIndex].image
                      ? style.dynamicImage
                      : style.DeafultImg
                  }
                  alt="Profile"
                />
              </div>
              {currentIndex < birthdayList.length - 1 && (
                <button
                  onClick={scrollRight}
                  className={`btn ${style.nextBtn}`}
                >
                  <img src={images.iconUp} className={`${style.Icon2}`} />
                </button>
              )}
              <h2 className={style.title}>
                {dayjs(birthdayList[currentIndex].dob).format("DD-MMM") ===
                dayjs().format("DD-MMM")
                  ? "Today"
                  : "Tomorrow"}
              </h2>
              <h3 className={style.name}>
                {birthdayList[currentIndex].name}, Birthday
              </h3>
              <p className={style.role}>
                {birthdayList[currentIndex].designation}
              </p>
            </div>
          ) : (
            <div className={`${style.card} ${style.noBdayCard}`}>
              <div className={`${style.birthdayIcon}`}>🎂</div>
              <h3 className={style.name}>No Birthday Today</h3>
              <p className={style.noBirthdayMsg}>
                Please check back tomorrow.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Birthday2;
