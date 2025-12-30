import React, { useState } from "react";
import { Mail, Key } from "lucide-react";
import {
  forgotPasswordService,
  sendPasswordToMail,
} from "../../services/ForgotPassword/ForgotPasswordService";
import { setAlertMessage } from "../../common/common";
import styles from "../../pages/Login/login.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const handleSubmit = async () => {
    if (loading) return;

    if (!email.trim()) {
      setEmailError("Please enter email address");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");

    try {
      setLoading(true);

      const result = await forgotPasswordService(email, setEmailError);
      if (result) {
        setIsSuccess(true);
        setEmail("");
        setAlertMessage("success", "Password sent to your mail");
      }
    } catch (error) {
      setAlertMessage("error", "Failed to send mail, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="min-vh-900 d-flex align-items-center justify-content-center"
      style={{
        padding: "20px",
      }}
    >
      <div
        className={styles.forgotBG}
      >
        {isSuccess ? (
          /* ✅ SUCCESS VIEW */
          <>
          <div className={`${styles.formHeader}`}>
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#2ecc71",
              }}
            >
              <Mail size={36} color="#fff" />
            </div>

            <h2 >
              Email Sent!
            </h2>

            <p >
              Your login credentials have been sent to your registered email
              address.
            </p>

            
          </div>
           <div className="text-center mt-3">
          <p className={styles.forgotText}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Back to Login
            </a>
          </p>
        </div>
        </>
        ) : (
          <>
            <div className="text-center mb-3">
              <div
                className="d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Key size={40} color="#ffffff" />
              </div>
            </div>

            {/* Title */}
            <div className={` ${styles.formHeader}`}>
              <h2 >
                Forgot Password?
              </h2>
              <p
                className="text-muted mb-0"
              >
                Please enter your email to get password
              </p>
            </div>

            {/* Email Input */}

            <div className={styles.inputGroup} style={{marginBottom: "30px"}}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if(emailError) setEmailError("")
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              {emailError && (
                <p >
                  <ErrorMessage message={emailError} />
                </p>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSubmit}
            className={`w-100 ${styles.loginButton}`}
              
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 16px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {loading ? (
                <div
                  className="spinner-border"
                  style={{ height: "18px", width: "18px", borderWidth: "2px" }}
                ></div>
              ) : (
                "Send"
              )}
            </button>

             {/* Back to Login */}
        <div className="text-center mt-3">
          <p className={styles.forgotText}>
            Wait, I remembered my password!{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = "none";
              }}
            >
              Back to Login
            </a>
          </p>
        </div>
          </>
        )}

       
      </div>
    </div>
  );
};

export default ForgotPassword;
