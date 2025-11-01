import React, { useEffect, useState } from 'react'
import { imagesRefPath } from '../../common/imagesRef/imagesRefPath';
import { IconBack } from '../../assets/images/ImagePath';
import * as action from '../../actions/SignUp/signUpAction';

const OtpVerified = (props) => {
    const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (props.resendOtp) {
            const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
          
            props.setDataObj(preState => ({
                ...preState,
                otp: fourDigitCode
            }))
            props.setResendOtp(false);
        }
    }, [props.resendOtp, props.setResendOtp])

    useEffect(() => {
        let interval;
        if (resendDisabled) {
            interval = setInterval(() => {
                setTimer((pretimer) => pretimer - 1);
            }, 1000);
        }
        if (timer === 0) {
            setResendDisabled(false);
            setTimer(30);
        }
        return () => {
            clearInterval(interval);
        };
    }, [resendDisabled, timer]);

    const handleResendClick = (e) => {
        e.preventDefault();
        props.setResendOtp(!props.resendOtp);
        setResendDisabled(true);
        setOtpInputs(["", "", "", ""]);
    };

    const handleBackClick = () => {
        props.setShowOtpComponent(false);
    };

    const handleInputChange = (index, value) => {
        action.handleOnOtpChange(index, value, setOtpInputs, otpInputs);
    };

    const handleOtpVerified = () => {
        action.otpVerified(otpInputs, props);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleOtpVerified();
        }
        if (e.key === "Backspace" && !otpInputs[index]) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    return (
        <>
            <div className="back-option">
                <button
                    onClick={handleBackClick}
                    className="back-button">
                    <IconBack className={`backIcon`} />
                </button>
            </div>
            <div className="login100-form validate-form">
                <div className=" login100-form-title text-center">
                    <div className={`imgCenter`}>
                        <img
                            style={{ width: "200px", marginBottom: "15px" }}
                            src={imagesRefPath.otpVerified}
                            alt="Otp GIF"
                        />
                    </div>

                    <h5>Verify Your Email</h5>
                    <p>
                        A one time passcode has been sent to{" "}
                        <span className="mail-send-text">{props.dataObj?.email || ""}</span>
                    </p>
                </div>

                <div
                    className="d-flex flex-row justify-content-center otpGroup mb-3"
                    style={{ gap: "12px" }}
                >
                    {otpInputs.map((input, index) => {
                        return (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                name={`otp-input-${index}`}
                                type="text"
                                maxLength={4}
                                pattern="[0-9]*"
                                required
                                className="input-control"
                                value={input}
                                autoComplete="off" // Disable autocomplete
                                style={{
                                    width: "42px",
                                    height: "45px",
                                    marginRight: "2px",
                                    textAlign: "center",
                                }}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onChange={(e) => {
                                    handleInputChange(index, e.target.value);
                                }}
                            />
                        );
                    })}
                </div>
                <div className="login-btn"
                    onClick={handleOtpVerified}
                >
                    <button className="login hvr-shutter-in-horizontal" >Confirm</button>
                </div>
                <div className="text-center mt-4 ">
                    {resendDisabled ? (
                        <p
                            className="font-weight-bold opt-text"
                            style={{ color: "#93979b" }}
                        >
                            Resend OTP in {timer} seconds
                        </p>
                    ) : (
                        <p className="d-block email-text opt-text">
                            Didn't receive the OTP? &nbsp;
                            <span
                                className="font-weight-bold  cursor recetive-here"
                                onClick={(e) => {
                                    handleResendClick(e);
                                }}
                            >
                                "Click here to resend."
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default OtpVerified