import { useEffect, useState } from 'react';
import { Eye, EyeOff, User} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { login } from '../../services/supabaseServices';
import { setAlertMessage } from '../../common/common';
import dayjs from 'dayjs';
import { FaSpinner } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    let loginStatus = localStorage.getItem("isLogin");
    if (loginStatus === "success") {
      navigate("/Dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(emailId, password);
      localStorage.setItem("isLogin", "success");
      localStorage.setItem("name", user?.name);
      localStorage.setItem("loginDate", dayjs().format("DD/MM/YYYY"));
      navigate("/Dashboard");
      setAlertMessage("success", "Login successfully");
    } catch (err) {
      setAlertMessage("error", err.message);
    }
    finally{
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div className="container">
        <div
          className="row bg-white rounded-4 shadow-lg overflow-hidden"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          {/* Left Section */}
          <div
            className="col-lg-6 d-flex flex-column align-items-center justify-content-center text-white p-5"
            style={{
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
              minHeight: "600px",
            }}
          >
            {/* Illustration */}
            <div className="mb-4" style={{ maxWidth: "350px", width: "100%" }}>
              {/* Person */}
              <div className="d-flex justify-content-center mb-3">
                <div
                  style={{
                    position: "relative",
                    width: "120px",
                    height: "140px",
                  }}
                >
                  {/* Hair */}
                  <div
                    style={{
                      width: "90px",
                      height: "50px",
                      background: "#2c3e50",
                      borderRadius: "50px 50px 0 0",
                      position: "absolute",
                      top: "-5px",
                      left: "15px",
                    }}
                  ></div>
                  {/* Head */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "#95a5a6",
                      borderRadius: "50%",
                      border: "4px solid #34495e",
                      position: "absolute",
                      left: "20px",
                    }}
                  ></div>
                  {/* Body */}
                  <div
                    style={{
                      width: "100px",
                      height: "60px",
                      background: "#3498db",
                      borderRadius: "10px 10px 0 0",
                      position: "absolute",
                      bottom: "0",
                      left: "10px",
                      border: "4px solid #34495e",
                    }}
                  ></div>
                </div>
              </div>

              {/* Clipboard */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  height: "320px",
                  background: "#ecf0f1",
                  borderRadius: "15px",
                  border: "4px solid #34495e",
                  margin: "0 auto",
                  position: "relative",
                  padding: "40px 20px",
                }}
              >
                {/* Clip */}
                <div
                  style={{
                    width: "100px",
                    height: "30px",
                    background: "#34495e",
                    borderRadius: "15px",
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                ></div>

                {/* Checkmark */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "#2ecc71",
                    borderRadius: "50%",
                    position: "absolute",
                    left: "25px",
                    top: "90px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #34495e",
                    fontSize: "36px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </div>

                {/* List lines */}
                <div
                  style={{
                    position: "absolute",
                    right: "30px",
                    top: "90px",
                  }}
                >
                  {[100, 50, 80, 60, 90].map((width, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: `${width}px`,
                        height: "12px",
                        background: "#34495e",
                        margin: "12px 0",
                        borderRadius: "6px",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="fs-3 fw-bold mb-2 text-center">Door-To-Door</h2>
            <p
              className="text-center"
              style={{ opacity: 0.9, maxWidth: "400px" }}
            >
              “Door-to-door waste collection” refers to a system where waste is
              collected directly from households, individuals to take their
              waste to a central dumping site. It’s commonly used in urban
              sanitation programs to manage municipal solid waste efficiently.
            </p>
          </div>

          {/* Right Section */}
          <div className="col-lg-6 p-5 d-flex flex-column justify-content-center">
            {/* Logo */}
            <div className="text-center mb-4">
              <div
                className="d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
                  borderRadius: "15px",
                  margin: "0 auto",
                  fontSize: "30px",
                }}
              >
                👥
              </div>
              <h3
                className="text-uppercase fw-semibold"
                style={{
                  color: "#2c3e50",
                  fontSize: "16px",
                  letterSpacing: "1px",
                }}
              >
                D2D Portal
              </h3>
            </div>

            {/* Login Header */}
            <div className="text-center mb-4">
              <h1 className="fs-4 fw-bold" style={{ color: "#2c3e50" }}>
                Please login to continue.
              </h1>
            </div>

            {/* Form */}
            <div>
              {/* Employee Code */}
              <div className="mb-3">
                <label
                  className="form-label text-uppercase text-muted"
                  style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                >
                  Email Id
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter email id"
                    autoFocus
                    style={{
                      padding: "12px 45px 12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "10px",
                      background: "#f8f9fa",
                      fontSize: "14px",
                    }}
                  />
                  <span
                    className="position-absolute"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <User size={18} color="#bdc3c7" />
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label
                  className="form-label text-uppercase text-muted"
                  style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                >
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      padding: "12px 45px 12px 15px",
                      border: "2px solid #e0e0e0",
                      borderRadius: "10px",
                      background: "#f8f9fa",
                      fontSize: "14px",
                    }}
                  />
                  <span
                    className="position-absolute"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} color="#bdc3c7" />
                    ) : (
                      <Eye size={18} color="#bdc3c7" />
                    )}
                  </span>
                </div>
              </div>

              

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                className="btn w-100 text-white fw-semibold"
                style={{
                  padding: "15px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 10px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {loading ? (
                  <div className="spinner-border" style={{height:'20px',width:'20px',borderWidth:'2px'}}></div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


{/* Options */}
              {/* <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="text-muted" 
                         style={{ fontSize: '14px', cursor: 'pointer' }} 
                         htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>
                <a href="#" 
                   className="text-decoration-none fw-semibold"
                   style={{ color: '#667eea', fontSize: '14px' }}>
                  Forgot password?
                </a>
              </div> */}