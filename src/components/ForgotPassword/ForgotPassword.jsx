import React, { useState } from 'react';
import { Mail, Key } from 'lucide-react';
import { forgotPasswordService, sendPasswordToMail } from '../../services/ForgotPassword/ForgotPasswordService';
import { setAlertMessage } from '../../common/common';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async() => {
    if(loading) return;

    try{
      setLoading(true)

      const result = await forgotPasswordService(email)
      if(result){
      setIsSuccess(true)
      setEmail('');
      setAlertMessage('success', "Password sent to your mail");
      }
    }catch(error){
      setAlertMessage('error', 'Failed to send mail, Please try again.')
    }finally{
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
        className="bg-white rounded-3 p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
        }}
      >
       {isSuccess ? (
 /* ✅ SUCCESS VIEW */
        <div className="text-center">
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

          <h2 className="fs-4 fw-bold mb-2" style={{ color: "#2c3e50" }}>
            Email Sent!
          </h2>

          <p className="text-muted" style={{ fontSize: "13px" }}>
            Your login credentials have been sent to your registered email
            address.
          </p>
          </div>
       ):(
        <>
        <div className="text-center mb-3">
          <div
            className="d-flex align-items-center justify-content-center mx-auto"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Key size={40} color="#ffffff" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h1 className="fs-4 fw-bold mb-1" style={{ color: "#2c3e50" }}>
            Forgot Password?
          </h1>
          <p
            className="text-muted mb-0"
            style={{
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            Please enter your email to get password
          </p>
        </div>

        {/* Email Input */}
        <div className="my-3">
          <label
            className="form-label text-uppercase text-muted mb-1"
            style={{ fontSize: "10px", letterSpacing: "0.5px", fontWeight: "600" }}
          >
            Email Address
          </label>
          <div className="position-relative">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your email"
              autoFocus
              style={{
                padding: "10px 40px 10px 12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                background: "#f8f9fa",
                fontSize: "14px",
              }}
            />
            <span
              className="position-absolute"
              style={{
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <Mail size={16} color="#bdc3c7" />
            </span>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          className="btn w-100 text-white fw-semibold"
          style={{
            padding: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
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
        </>
       )}

        {/* Back to Login */}
        <div className="text-center mt-3">
          <p className="mb-0" style={{ fontSize: "13px", color: "#6c757d" }}>
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
      </div>
    </div>
  );
};

export default ForgotPassword;