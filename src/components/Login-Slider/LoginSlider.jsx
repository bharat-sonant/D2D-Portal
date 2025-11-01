import React from "react";
import { imagesRefPath } from "../../common/imagesRef/imagesRefPath";
import styles from "../../Style/SignUp/SignUp.module.css";
import '../../Style/Login/LoginSlider.css';
import '../../Style/Login/Login.css';

export const LoginSlider = () => {

    return (
        <div className="col-lg-8 p-0 limiterpros limiterprosSlide">
            <div
                id="carouselExampleCaptions"
                className="carousel slide"
                data-bs-ride="carousel"
            >
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="0"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="8000">
                        <img
                            className="img-fluid MediaMin zoom-animation"
                            src={imagesRefPath.slider1}
                            alt="not found"
                            style={{ height: "100vh" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            {/* <h1 className={`${styles.pageTitle}`}>Add Attendance</h1>
                            <p className={`${styles.pageInfo}`}>
                                Develop a detailed city management system with clear processes
                                and thorough documentation, enabling developers to easily
                                integrate and manage urban functionalities.
                            </p> */}
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="8000">
                        <img
                            className="img-fluid MediaMin zoom-animation"
                            src={imagesRefPath.slider2}
                            alt="not found"
                            style={{ height: "100vh" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            {/* <h1 className={`${styles.pageTitle}`}>Update Attendance</h1>
                            <p className={`${styles.pageInfo}`}>
                                Organize and manage JOB cards efficiently by creating and
                                assigning tasks and subtasks to the relevant team members, with
                                clear deadlines for each task to ensure timely completion.
                            </p> */}
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="8000">
                        <img
                            className="img-fluid MediaMin zoom-animation"
                            src={imagesRefPath.slider3}
                            alt="not found"
                            style={{ height: "100vh" }}
                        />
                        <div className="carousel-caption d-none d-md-block">
                            {/* <h1 className={`${styles.pageTitle}`}>Attendance List</h1> */}
                            {/* <p className={`${styles.pageInfo}`}>
                                Manage and update driver information seamlessly. Assign and
                                track drivers for each vehicle efficiently.
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
