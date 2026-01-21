import React, { useEffect, useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logoImg from '../../assets/images/FE_Logo.png';
import * as action from '../../Action/Login/Login_Action';
import { useCommon } from '../../Context/CommonContext/CommonContext';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [errors, setErrors] = useState({ auth: '' });
 const { showToast } = useCommon();
    // Test message jab page pehli baar load ho

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    if (name === 'userId') {
      // Action file se formatting logic call ho raha hai
      const formattedValue = action.formatUserId(value);
      setCredentials({ ...credentials, [name]: formattedValue });
    } else {
      setCredentials({ ...credentials, [name]: value });
    }

    if (errors.auth) setErrors({ auth: '' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    action.performLoginValidation(credentials, setErrors, setIsLoading, navigate, showToast);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.circleTop}></div>
      <div className={styles.circleBottom}></div>

      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoCircle}>
              <img src={logoImg} alt="FE Logo" className={styles.logo} />
            </div>
          </div>
          <h1 className={styles.mainTitle}>Field Executive</h1>
          <p className={styles.subTitle}>Wevios Labs Management Portal</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin} noValidate>
          {errors.auth && <div className={styles.authError}>{errors.auth}</div>}

          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>User ID</label>
            <div className={styles.inputField}>
              <User size={18} className={styles.fieldIcon} />
              <input
                type="text"
                name="userId"
                className={styles.capitalInput}
                value={credentials.userId}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="Enter User ID"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Password</label>
            <div className={styles.inputField}>
              <Lock size={18} className={styles.fieldIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="Enter Password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? (
              <><Loader2 size={20} className={styles.spinner} /><span>Please wait...</span></>
            ) : (
              <><span>LOGIN</span> <LogIn size={20} /></>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <div className={styles.secureLine}>
            <Shield size={12} />
            <span>Secure Enterprise Access</span>
          </div>
          <p className={styles.copyText}>© 2026 Wevios Labs Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;