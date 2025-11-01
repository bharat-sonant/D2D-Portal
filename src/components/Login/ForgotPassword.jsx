import React, { useRef, useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import userListStyle from "../../Style/SignUp/SignUp.module.css";
import { imagesRefPath } from "../../common/imagesRef/imagesRefPath";
import * as forgetAction from '../../actions/Login/LoginAction';

const ForgotPassword = (props) => {
    const [userNameVerfied, setUserNameVerified] = useState({
        show: false,
        email: "",
    });
    const [empCode, setEmpCode] = useState("");
    const [errorMessage, setErrorMessage] = useState({ error: false, msg: "" });

    const userNameInputRef = useRef(null);

    useEffect(() => {
        const focusInput = () => {
            if (userNameInputRef.current) {
                userNameInputRef.current.focus();
            }
        };
        const timer = setTimeout(focusInput, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSendPassword = () => {
        if (errorMessage.error) return;
        let userNameElement = document.getElementById("usernameValidation");
        forgetAction.sendPasswordOnMail(
            empCode,
            userNameElement,
            setErrorMessage,
            setUserNameVerified,
            props.companyCode,
            props.setLoginLoader
        );
    };

    const handleChange = (e) => {
        let userNameElement = document.getElementById("usernameValidation");
        forgetAction.forgotPasswordHandleOnchange(
            e,
            userNameElement,
            setEmpCode,
            setErrorMessage
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendPassword();
        }
    };

    return (
        <>
            {userNameVerfied.show ? (
                <div className="login100-form validate-form ">
                    <img
                        style={{ width: "130px", height: "130px", filter: "none" }}
                        src={imagesRefPath.emailSuccess}
                        alt="Email GIF"
                    />
                    <span className="login100-form-title mt-4  ">
                        <h5>Well done </h5>

                        <p>
                            Password has been sent to your registered email address{" "}
                            <span className="mail-send-text">
                                {userNameVerfied?.email || ""}
                            </span>
                        </p>
                        <div></div>
                    </span>

                    <div
                        className="login-btn"
                        onClick={() => {
                            props.setforgetPassword(!props.forgotPassword);
                            setUserNameVerified({ show: false, email: "" });
                            props.setShowSignUp(false);
                        }}
                    >
                        <button className="login hvr-shutter-in-horizontal">
                            Back To Login
                        </button>
                    </div>
                </div>
            ) : (
                <div className="login100-form validate-form   ">
                    <div className=" mt-2 login100-form-title">
                        <img
                            style={{ width: "100px", height: "100px", filter: "none" }}
                            src={imagesRefPath.keyGif}
                            alt="Email GIF"
                        ></img>
                        <h5 className=" mb-3">Forgot Password?</h5>
                        <p className="mt-1">
                            Please enter your employee code to retrieve your password.
                        </p>
                    </div>

                    <div>
                        <div className="mb-3">
                            <div className="form-floating mb-3">
                                <input
                                    ref={userNameInputRef}
                                    className="input-green form-control floating-input"
                                    type="text"
                                    value={empCode}
                                    id="usernameValidation"
                                    placeholder="Enter employee code"
                                    autoComplete="off"
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                                <div
                                    id="validationServerUsernameFeedback"
                                    className="invalid-feedback"
                                >
                                    {`${errorMessage.error ? errorMessage.msg : ""}`}
                                </div>
                                <label htmlFor="floatingInput" className="labelfont">
                                    Employee Code
                                </label>
                            </div>
                        </div>

                        <div className="login-btn" onClick={handleSendPassword}>
                            <button className="login hvr-shutter-in-horizontal" disabled={props.loginLoader}>
                                {props.loginLoader ? (
                                    <div className={userListStyle.Loginloadercontainer}>
                                        <FaSpinner className={userListStyle.spinnerLogin} />
                                        <span className={userListStyle.loaderText}>
                                            Please wait...
                                        </span>
                                    </div>
                                ) : (
                                    "Get Password"
                                )}
                            </button>
                        </div>
                        <div className="link-sign text-center">
                            <p className="mb-0" style={{ fontSize: "13px" }}>
                                Wait, I remember my password...{" "}
                                <span
                                    style={{
                                        cursor: "pointer",
                                        color: "blue",
                                    }}
                                    onClick={() => {
                                        props.setforgetPassword(!props.forgotPassword);
                                        props.setShowSignUp(false);
                                    }}
                                >
                                    Click here
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForgotPassword;
