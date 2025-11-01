import React, { useEffect, useRef, useState } from "react";
import "../../Style/Login/Login.css";
import "../../Style/css/common.css";
import modalStyles from "../../../src/assets/css/modal.module.css";
import OtpVerified from "./OtpVerified";
import VerifiedComplete from "./VerifiedComplete";
import * as ActionFile from "../../actions/SignUp/signUpAction";
import signStyle from "../../Style/SignUp/SignUp.module.css";
import { FaSpinner } from "react-icons/fa";
import "../../assets/css/floatingInput.css";
import { imagesRefPath } from "../../common/imagesRef/imagesRefPath";
import styles from "../../Style/SignUp/SignUp.module.css";
import { images } from "../../assets/css/imagePath";

const SignUpInput = (props) => {
  const [showOtpComponent, setShowOtpComponent] = useState(false);
  const [verfiedSuccessfully, setVerifiedSuccessfully] = useState(false);

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const companyNameInputRef = useRef(null);
  const [companyNameError, setCompanyNameError] = useState({
    error: false,
    msg: "",
  });
  const [emailError, setEmailError] = useState({ error: false, msg: "" });
  const [loader, setLoader] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [dataObj, setDataObj] = useState({});

  useEffect(() => {
    const focusInput = () => {
      if (companyNameInputRef.current) {
        companyNameInputRef.current.focus();
      }
    };
    const timer = setTimeout(focusInput, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkCompanyAndEmail();
    }
  };

  const handleOnChange = (type, e) => {
    ActionFile.handleChange(
      type,
      e,
      setCompanyNameError,
      setEmailError,
      setCompanyName,
      setEmail
    );
  };

  const checkCompanyAndEmail = () => {
    ActionFile.checkCompanyAndEmailExist(
      companyName,
      email,
      setCompanyNameError,
      setEmailError,
      setLoader,
      setShowOtpComponent,
      setDataObj
    );
  };

  return (
    <>
      {showOtpComponent ? (
        <OtpVerified
          setVerifiedSuccessfully={setVerifiedSuccessfully}
          setShowOtpComponent={setShowOtpComponent}
          resendOtp={resendOtp}
          setResendOtp={setResendOtp}
          setDataObj={setDataObj}
          dataObj={dataObj}
          companyName={companyName}
          email={email}
        />
      ) : verfiedSuccessfully ? (
        <VerifiedComplete
          dataObj={dataObj}
          setLoader={setLoader}
          showSignUp={props.showSignUp}
          setShowSignUp={props.setShowSignUp}
          loader={loader}
        />
      ) : (
        <div className="login100-form validate-form ">
          <span className="login100-form-title text-center  ">
            <img
              src={imagesRefPath.companyLogo}
              alt="wevois logo"
              className={styles.companyLogo}
            />
            <p className={styles.logoText}>Office Management</p>
            <h5>Register your account</h5>
            <p>Sign up to continue</p>
          </span>
          <div className={`col-md-12`}>
            <div className="form-floating form-floating-label mb-3">
              <input
                className="form-control"
                ref={companyNameInputRef}
                type="text"
                name="new-company-name"
                id="new-company-name"
                placeholder=""
                value={companyName}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => handleOnChange("company", e)}
                autoComplete="off"
              />
              <label for="floatingInput">Company Name</label>
              <img
                src={images.iconCompany}
                className={styles.iconDefault}
                title="Company name"
                alt="icon"
              />
              <div className={`${modalStyles.invalidfeedback}`}>
                {companyNameError.error ? companyNameError.msg : ""}
              </div>
            </div>

            {/* <div className={` ${modalStyles.textboxGroup}`}>
              <div className={`${modalStyles.textboxMain}`}>
                <div className={`${modalStyles.textboxLeft}`}>Company name</div>
                <div className={`${modalStyles.textboxRight}`}>
                  <input
                    className={`form-control required ${modalStyles.formTextbox}`}
                    ref={companyNameInputRef}
                    type="text"
                    name="new-company-name"
                    id="new-company-name"
                    placeholder="Enter company name"
                    value={companyName}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleOnChange("company", e)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className={`${modalStyles.invalidfeedback}`}>
                {companyNameError.error ? companyNameError.msg : ""}
              </div>
            </div> */}
          </div>
          <div className={`col-md-12`}>
            <div className="form-floating form-floating-label mb-3">
              <input
                className="form-control"
                type="email"
                name="new-email"
                id="new-email"
                placeholder=""
                value={email}
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => handleOnChange("email", e)}
              />
              <label for="floatingInput">Email address</label>
              <img
                src={images.iconEmail}
                className={styles.iconDefault}
                title="Email address"
                alt="icon"
              />
              <div className={`${modalStyles.invalidfeedback}`}>
                {emailError.error ? emailError.msg : ""}
              </div>
            </div>

            {/* <div className={` ${modalStyles.textboxGroup}`}>
              <div className={`${modalStyles.textboxMain}`}>
                <div className={`${modalStyles.textboxLeft}`}>
                  Email address
                </div>
                <div className={`${modalStyles.textboxRight}`}>
                  <input
                    className={`form-control required ${modalStyles.formTextbox}`}
                    type="email"
                    name="new-email"
                    id="new-email"
                    placeholder="Enter email address"
                    value={email}
                    autoComplete="off"
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleOnChange("email", e)}
                  />
                </div>
              </div>
              <div className={`${modalStyles.invalidfeedback}`}>
                {emailError.error ? emailError.msg : ""}
              </div>
            </div> */}
          </div>

          <div className={`login-btn mt-4`}>
            <button
              onClick={checkCompanyAndEmail}
              disabled={loader}
              className={modalStyles.btnSave}
            >
              {loader ? (
                <div className={signStyle.Loginloadercontainer}>
                  <FaSpinner className={signStyle.spinnerLogin} />
                  <span className={signStyle.loaderText}>Please wait...</span>
                </div>
              ) : (
                "Next"
              )}
            </button>
          </div>
          <div className="link-sign">
            <p className="mb-0" style={{ fontSize: "13px" }}>
              Already have an account ?{" "}
              <span
                onClick={() => {
                  props.setShowSignUp(!props.showSignUp);
                }}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpInput;
