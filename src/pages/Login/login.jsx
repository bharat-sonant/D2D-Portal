import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Car,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import styles from "../Login/login.module.css";
import { useNavigate } from "react-router-dom";
import {
  getDataByColumnName,
  login,
  upsertByConflictKeys,
} from "../../services/supabaseServices";
import {
  decryptValue,
  encryptValue,
  setAlertMessage,
} from "../../common/common";
import dayjs from "dayjs";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import { useCity } from "../../context/CityContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { createCityLogoUrl } from "../../Actions/commonActions";
import GlobalSpinnerLoader from "../../components/Common/Loader/GlobalSpinnerLoader";
import GlobalCheckbox from "../../components/Common/GlobalCheckbox/GlobalCheckbox";
import { updateUserLastLogin } from "../../services/UserServices/UserServices";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setforgetPassword] = useState(false);
  const { setCityContext } = useCity();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const DESIGN_DURATION = 3 * 24 * 60 * 60 * 1000;
  // const DESIGN_DURATION = 30 * 1000;

  const [activeDesign, setActiveDesign] = useState(1);
  useEffect(() => {
    rememberMefunction();
    let loginStatus = localStorage.getItem("isLogin");
    if (loginStatus === "success") {
      navigate("/d2dMonitoring/dashboard");
    }
  }, []);

  const rememberMefunction = () => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmailId(decryptValue(savedEmail));
      setPassword(decryptValue(savedPassword));
      setRememberMe(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailId.trim()) {
      setEmailError("Please enter email address");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter password");
      return;
    }

    if (!emailRegex.test(emailId.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setPasswordError("");
    try {
      setLoading(true);
      const user = await login(
        emailId,
        password,
        setEmailError,
        setPasswordError,
      );
      if (!user) {
        setLoading(false);
        return;
      }
      await updateUserLastLogin(user.id); /////////////////

      localStorage.setItem("isLogin", "success");
      localStorage.setItem("name", user?.name);
      localStorage.setItem("userId", user?.id);
      localStorage.setItem("loginDate", dayjs().format("DD/MM/YYYY"));
      localStorage.setItem("defaultCity", user?.default_city);
      await fetchCityName(user?.default_city).then(() => {
        if (rememberMe) {
          localStorage.setItem("savedEmail", encryptValue(emailId));
          localStorage.setItem("savedPassword", encryptValue(password));
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }
        navigate("/d2dMonitoring/dashboard");
      });
      const loginDetail = {
        user_id: user?.id,
        login_date: dayjs().format("YYYY-MM-DD"),
      };
      upsertByConflictKeys(
        "UserLoginHistory",
        loginDetail,
        "user_id,login_date",
      );
    } catch (err) {
      setAlertMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  const fetchCityName = async (defaultCityId) => {
    if (defaultCityId) {
      const resp = await getDataByColumnName(
        "Sites",
        "site_id",
        defaultCityId,
      );
      if (resp?.success) {
        const siteName = resp?.data?.[0]?.site_name || "";
        setCityContext({
          city: siteName,
          cityId: defaultCityId,
          cityLogo: createCityLogoUrl(resp?.data?.[0]?.site_code),
        });
      }
    }
    return;
  };
  useEffect(() => {
    const savedDesign = localStorage.getItem("activeLoginDesign");
    const savedTime = localStorage.getItem("loginDesignTime");

    const now = Date.now();

    if (savedDesign && savedTime) {
      const elapsed = now - Number(savedTime);

      if (elapsed >= DESIGN_DURATION) {
        const nextDesign = savedDesign === "1" ? "2" : "1";
        setActiveDesign(Number(nextDesign));
        localStorage.setItem("activeLoginDesign", nextDesign);
        localStorage.setItem("loginDesignTime", now.toString());
      } else {
        setActiveDesign(Number(savedDesign));
      }
    } else {
      localStorage.setItem("activeLoginDesign", "1");
      localStorage.setItem("loginDesignTime", now.toString());
      setActiveDesign(1);
    }

    const interval = setInterval(() => {
      setActiveDesign((prev) => {
        const next = prev === 1 ? 2 : 1;
        localStorage.setItem("activeLoginDesign", next.toString());
        localStorage.setItem("loginDesignTime", Date.now().toString());
        return next;
      });
    }, DESIGN_DURATION);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <CheckCircle size={20} />,
      title: "100% Waste Collection",
      desc: "Complete pickup across all locations",
    },
    {
      icon: <Zap size={20} />,
      title: "Realtime Tracking",
      desc: "Live updates on collection status",
    },
    {
      icon: <Leaf size={20} />,
      title: "Eco-Friendly",
      desc: "Sustainable waste management",
    },
  ];
  return (
    <>
      <div className={styles.designWrapper}>
        <div
          className={`${styles.designScreen} ${
            activeDesign === 1 ? styles.active : styles.hidden
          }`}
        >
          {/* Login Design 1 */}
          <div className={styles.container}>
            {/* Floating Orbs */}
            <div className={styles.floatingOrbs}>
              <span className={`${styles.orb} ${styles.orbOne}`} />
              <span className={`${styles.orb} ${styles.orbTwo}`} />
              <span className={`${styles.orb} ${styles.orbThree}`} />
            </div>
            {/* Main Content */}
            {forgotPassword ? (
              <ForgotPassword onBack={() => setforgetPassword(false)} />
            ) : (
              <>
                <div className={styles.mainCard}>
                  {/* LEFT */}
                  <div className={styles.leftSection}>
                    <div className={styles.logo}>
                      <div className={styles.logoIcon1}>
                        <img src="/wevoisLogo.png" alt="WeVOIS logo" />
                      </div>
                      <span className={styles.logoText}>WeVOIS Portal</span>
                    </div>

                    <h1 className={styles.heroTitle}>Smart Waste Management</h1>

                    <p className={styles.heroSubtitle}>
                      Intelligent, eco-friendly waste collection solutions
                      powered by <b> WeVOIS</b>.
                    </p>

                    <div className={styles.features}>
                      {features.map((f, i) => (
                        <div key={i} className={styles.feature}>
                          <div className={styles.featureIcon}>{f.icon}</div>
                          <div>
                            <div className={styles.featureTitle}>{f.title}</div>
                            <div className={styles.featureDesc}>{f.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className={styles.rightSection}>
                    <div className={styles.logo}>
                      <div className={styles.logoIcon1}>
                        <img src="/wevoisLogo.png" alt="WeVOIS logo" />
                      </div>
                      <span className={styles.logoText}>WeVOIS Portal</span>
                    </div>
                    <h2 className={styles.welcomeText}>Welcome Back!</h2>
                    <p className={styles.subtitle}>
                      Please login to continue to your account
                    </p>

                    <div className={styles.loginForm}>
                      <div className={styles.inputGroup}>
                        <label htmlFor={emailId}>Email Address</label>
                        <div className={styles.inputWrapper}>
                          <Mail className={styles.inputIcon} size={20} />
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={emailId}
                            onChange={(e) => {
                              setEmailId(e.target.value);
                              if (emailError) setEmailError("");
                            }}
                            onKeyDown={handleKeyDown}
                            autoComplete="new-password"
                            autoFocus
                          />
                        </div>
                        {emailError && (
                          <p>
                            <ErrorMessage message={emailError} />
                          </p>
                        )}
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor={password}>Password</label>
                        <div className={styles.inputWrapper}>
                          <Lock className={styles.inputIcon} size={20} />
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (passwordError) setPasswordError("");
                            }}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                          />
                          <button
                            className={styles.togglePassword}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        {passwordError && (
                          <p>
                            <ErrorMessage message={passwordError} />
                          </p>
                        )}
                      </div>

                      <div className={styles.formFooter}>
                        <GlobalCheckbox
                          id="rememberMe"
                          label="Remember me"
                          checked={rememberMe}
                          onChange={handleRememberMe}
                        />

                        <Link
                          className={styles.forgotLink}
                          onClick={(e) => {
                            e.preventDefault();
                            setforgetPassword(true);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = "none";
                          }}
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className={styles.loginButton}
                        disabled={loading}
                      >
                        {loading ? (
                          <GlobalSpinnerLoader />
                        ) : (
                          <>
                            <span>Login</span>
                            <ArrowRight
                              className={styles.arrowIcon}
                              size={20}
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div
          className={`${styles.designScreen} ${
            activeDesign === 2 ? styles.active : styles.hidden
          }`}
        >
          {/* Login Design 2 */}
          <div className={`${styles.loginContainer}`}>
            {/* Animated Background */}
            <div className="background">
              <div className={` ${styles.gradientOrb} ${styles.orb1}`}></div>
              <div className={` ${styles.gradientOrb} ${styles.orb2}`}></div>
              <div className={` ${styles.gradientOrb} ${styles.orb3}`}></div>
              <div className={`${styles.gridOverlay}`}></div>
            </div>

            {/* Floating Particles */}
            <div className={`${styles.particles}`}>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Main Content */}
            {forgotPassword ? (
              <ForgotPassword onBack={() => setforgetPassword(false)} />
            ) : (
              <>
                <div className={styles.contentWrapper}>
                  {/* Left Side - Branding */}

                  <div className={`${styles.brandingSection}`}>
                    <div
                      className={`${styles.logoContainer} ${styles.logoContainerDesktop}`}
                    >
                      <div className={styles.logoIcon}>
                        <img src="/wevoisLogo.png" alt="WeVOIS logo" />
                      </div>
                      <h1 className={styles.brandTitle}>WeVOIS Portal</h1>
                    </div>

                    <div className={styles.tagline}>
                      <h2>Door-To-Door Waste Collection</h2>
                      <p>
                        Smart solutions for a cleaner tomorrow. Join thousands
                        making a difference today.
                      </p>
                    </div>

                    <div className={styles.featureslist}>
                      <div className={styles.featureItem}>
                        <Car size={18} className={styles.featureIcon} />
                        <div>
                          <h4>100% Waste Collection</h4>
                          <p>
                            Ensuring complete waste pickup across all assigned
                            locations
                          </p>
                        </div>
                      </div>
                      <div className={styles.featureItem}>
                        <Zap size={18} className={styles.featureIcon} />
                        <div>
                          <h4>Realtime Tracking</h4>
                          <p>
                            Track waste collection live with accurate, real-time
                            updates
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.illustration}>
                      <div
                        className={`${styles.floatingCard} ${styles.cardPrimary}`}
                      >
                        <div className={styles.cardIcon}>✓</div>
                        <span>Verified Service</span>
                      </div>
                      <div
                        className={` ${styles.floatingCard} ${styles.cardSecondary}`}
                      >
                        <div className={`${styles.cardIcon}`}>♻️</div>
                        <span>Eco-Friendly</span>
                      </div>
                      <div
                        className={`${styles.floatingCard} ${styles.cardTertiary}`}
                      >
                        <div className={styles.cardIcon}>⚡</div>
                        <span>Quick Pickup</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Login Form */}
                  <div
                    className={`${styles.logoContainer} ${styles.logoContainerMobile}`}
                  >
                    <div className={styles.logoIcon}>
                      <img src="/wevoisLogo.png" alt="WeVOIS logo" />
                    </div>
                    <h1 className={styles.brandTitle}>WeVOIS Portal</h1>
                  </div>
                  <div className={styles.formSection}>
                    <div className={styles.formCard}>
                      <div className={styles.formHeader}>
                        <h2>Welcome Back!</h2>
                        <p>Please login to continue to your account</p>
                      </div>

                      <div className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                          <label htmlFor={emailId}>Email Address</label>
                          <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={20} />
                            <input
                              type="email"
                              id="email"
                              placeholder="Enter your email"
                              value={emailId}
                              onChange={(e) => {
                                setEmailId(e.target.value);
                                if (emailError) setEmailError("");
                              }}
                              onKeyDown={handleKeyDown}
                              autoComplete="new-password"
                              autoFocus
                            />
                          </div>
                          {emailError && (
                            <p>
                              <ErrorMessage message={emailError} />
                            </p>
                          )}
                        </div>

                        <div className={styles.inputGroup}>
                          <label htmlFor={password}>Password</label>
                          <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={20} />
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              value={password}
                              onKeyDown={handleKeyDown}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) setPasswordError("");
                              }}
                              placeholder="Enter your password"
                              autoComplete="new-password"
                            />
                            <button
                              className={styles.togglePassword}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                          {passwordError && (
                            <p>
                              <ErrorMessage message={passwordError} />
                            </p>
                          )}
                        </div>

                        <div className={styles.formFooter}>
                          <GlobalCheckbox
                            id="rememberMe"
                            label="Remember me"
                            checked={rememberMe}
                            onChange={handleRememberMe}
                          />

                          <Link
                            className={styles.forgotLink}
                            onClick={(e) => {
                              e.preventDefault();
                              setforgetPassword(true);
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.textDecoration = "none";
                            }}
                          >
                            Forgot password?
                          </Link>
                        </div>

                        <button
                          onClick={handleSubmit}
                          className={styles.loginButton}
                          disabled={loading}
                        >
                          {loading ? (
                            <GlobalSpinnerLoader />
                          ) : (
                            <>
                              <span>Login</span>
                              <ArrowRight
                                className={styles.arrowIcon}
                                size={20}
                              />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
