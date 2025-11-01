import React, { useEffect, useRef, useState } from 'react';
import { imagesRefPath } from '../../common/imagesRef/imagesRefPath';
import { AiFillEye, AiFillEyeInvisible, AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkSharp } from 'react-icons/io5';
import * as action from '../../actions/SignUp/signUpAction';
import signStyle from '../../Style/SignUp/SignUp.module.css';
import { FaSpinner } from 'react-icons/fa';
import { usePermissions } from '../../context/PermissionContext';


const VerifiedComplete = (props) => {
    const [empCode, setEmpCode] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [hide, setHide] = useState(false);
    const [empCodeError, setEmpCodeError] = useState({ error: false, msg: "" });
    const [passwordError, setPasswordError] = useState({ error: false, msg: "" });
    const [nameError, setNameError] = useState({ error: false, msg: "" });
    const navigate = useNavigate();
    const nameRef = useRef(null);
     const {setOwnerStatus} = usePermissions();

    useEffect(() => {
        const focusInput = () => {
            if (nameRef.current) {
                nameRef.current.focus();
            }
        };
        const timer = setTimeout(focusInput, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleOnchange = (type, e) => {
        action.handleOnChangeVerified(
            type,
            e,
            setEmpCode,
            setEmpCodeError,
            setPassword,
            setPasswordError,
            setName,
            setNameError,
            setHide,
            setError
        );
    };

    const handleSign = () => {
        if (empCodeError.error) return;
        action.registerCompany(
            empCode,
            password,
            setEmpCodeError,
            setPasswordError,
            setError,
            setHide,
            props,
            navigate,
            name,
            setNameError,
            setOwnerStatus
        )
    };

    const passwordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSign();
        }
    };

    return (
        <>
            <div className="login100-form validate-form ">
                <img
                    style={{ width: "100%", height: "auto", marginTop: "-40px" }}
                    src={imagesRefPath.verfiedGif}
                    alt="verified GIF"
                />
                <span className="login100-form-title text-center ">
                    <h5>Congratulations</h5>
                    <p>
                        {" "}
                        Please create your own login credentials to be login into the portal
                    </p>
                </span>

                <div className="wrap-input-effects">
                    <div className="form-floating mb-4">
                        <input
                            ref={nameRef}
                            className="input-green form-control floating-input"
                            type="text"
                            placeholder="Enter name"
                            id="nameValidation"
                            value={name}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => handleOnchange("name", e)}
                            autoComplete="off"
                        />
                        <div
                            id="validationServerUsernameFeedback"
                            className="invalid-feedback"
                        >
                            {nameError.error ? nameError.msg : ""}
                        </div>
                        <label htmlFor="floatingInput" className="labelfont">
                            Name
                        </label>
                    </div>
                </div>

                <div className="wrap-input-effects">
                    <div className="form-floating mb-4">
                        <input
                            className="input-green form-control floating-input"
                            type="text"
                            placeholder="Enter username"
                            id="userNameValidation"
                            value={empCode}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => handleOnchange("empCode", e)}
                            autoComplete="off"
                        />
                        <div
                            id="validationServerUsernameFeedback"
                            className="invalid-feedback"
                        >
                            {empCodeError.error ? empCodeError.msg : ""}
                        </div>
                        <label htmlFor="floatingInput" className="labelfont">
                            Username
                        </label>
                    </div>
                </div>
                <div className="wrap-input-effects">
                    <div className="form-floating mb-3">
                        <input
                            className="input-green form-control floating-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            id="passwordValidation"
                            value={password}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => {
                                handleOnchange("pwd", e);
                            }}
                            autoComplete="new-password"
                        />
                        <div
                            id="validationServerUsernameFeedback"
                            className="invalid-feedback"
                        >
                            {passwordError.error ? passwordError.msg : ""}
                        </div>
                        <label htmlFor="floatingInput" className="labelfont">
                            Password
                        </label>
                    </div>
                    {showPassword ? (
                        <AiFillEye
                            hidden={hide ? true : false}
                            style={{
                                position: "absolute",
                                right: "18px",
                                top: "30%",
                                cursor: "pointer",
                                color: "grey",
                                fontSize: "20px",
                            }}
                            onClick={passwordVisibility}
                        />
                    ) : (
                        <AiFillEyeInvisible
                            hidden={hide ? true : false}
                            style={{
                                position: "absolute",
                                right: "18px",
                                top: "30%",
                                cursor: "pointer",
                                color: "grey",
                                fontSize: "20px",
                            }}
                            onClick={passwordVisibility}
                        />
                    )}
                </div>
                {error && (
                    <div className="error-card">
                        <ul
                            className="error-list"
                            style={{
                                backgroundColor: "#f0f5f5",
                                listStyleType: "none",
                                padding: "0.5rem",
                                fontSize: "12px",
                                borderRadius: "10px",
                            }}
                        >
                            <span
                                className="error-heading"
                                style={{
                                    backgroundColor: "#f3f6f9",
                                    margin: "0",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    padding: "5px",
                                }}
                            >
                                Password must contain :
                            </span>
                            <li
                                style={{
                                    color: password.length >= 8 ? "green" : "red",
                                    margin: "5px",
                                }}
                            >
                                {password.length >= 8 ? (
                                    <IoCheckmarkSharp style={{ color: "green" }} />
                                ) : (
                                    <AiOutlineClose style={{ color: "red" }} />
                                )}{" "}
                                Minimum 8 Characters
                            </li>
                            <li
                                style={{
                                    color: /^(?=.*[a-z])/.test(password) ? "green" : "red",
                                    margin: "5px",
                                }}
                            >
                                {/^(?=.*[a-z])/.test(password) ? (
                                    <IoCheckmarkSharp style={{ color: "green" }} />
                                ) : (
                                    <AiOutlineClose style={{ color: "red" }} />
                                )}{" "}
                                At least one lowercase letter (a-z)
                            </li>
                            <li
                                style={{
                                    color: /^(?=.*[A-Z])/.test(password) ? "green" : "red",
                                    margin: "5px",
                                }}
                            >
                                {/^(?=.*[A-Z])/.test(password) ? (
                                    <IoCheckmarkSharp style={{ color: "green" }} />
                                ) : (
                                    <AiOutlineClose style={{ color: "red" }} />
                                )}{" "}
                                At least one uppercase letter (A-Z)
                            </li>
                            <li
                                style={{
                                    color: /^(?=.*\d)/.test(password) ? "green" : "red",
                                    margin: "5px",
                                }}
                            >
                                {/^(?=.*\d)/.test(password) ? (
                                    <IoCheckmarkSharp style={{ color: "green" }} />
                                ) : (
                                    <AiOutlineClose style={{ color: "red" }} />
                                )}{" "}
                                At least one number (0-9)
                            </li>
                            <li
                                style={{
                                    color: /^(?=.*[@$!%#*?&\s])/.test(password) ? "green" : "red",
                                    margin: "5px",
                                }}
                            >
                                {/^(?=.*[@$!%#*?&\s])/.test(password) ? (
                                    <IoCheckmarkSharp style={{ color: "green" }} />
                                ) : (
                                    <AiOutlineClose style={{ color: "red" }} />
                                )}{" "}
                                At least one special character (e.g:- @#%?)
                            </li>
                        </ul>
                    </div>
                )}

                <div className="login-btn">
                    <button className="login hvr-shutter-in-horizontal" type="button" onClick={handleSign}
                        disabled={props.loader}>
                        {props.loader ? (
                            <div className={signStyle.Loginloadercontainer}>
                                <FaSpinner className={signStyle.spinnerLogin} />
                                <span className={signStyle.loaderText}>Please wait...</span>
                            </div>
                        ) :
                            "Sign In"
                        }
                    </button>
                </div>
            </div>
        </>
    )
}

export default VerifiedComplete