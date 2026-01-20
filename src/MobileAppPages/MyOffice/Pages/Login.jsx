import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FaUserAlt } from "react-icons/fa";
import style from '../Style/Login/Login.module.css';
import { images } from '../../../assets/css/imagePath';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';
import * as loginAction from '../Action/Login/LoginAction';

const MyOfficeLogin = () => {
    const [formData, setFormData] = useState({ empCode: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = (e) => {
        loginAction.handleChange(e, setFormData, setErrors);
    }

    const onSubmit = (e) => {
        loginAction.handleSubmit(e, setIsLoading, formData, setErrors);
    }

    return (
        <div className={style.loginContainer}>
            <div className={style.loginWrapper}>
                <div className={style.loginHeader}>
                    <div className={style.logo}>
                        <img src={images.defaultLogo} alt="logo" />
                    </div>
                    <h1 className={style.loginTitle}>My Office</h1>
                    <p className={style.loginSubtitle}>Welcome back! Please login to continue</p>
                </div>

                <div className={style.loginCard}>
                    <form onSubmit={onSubmit} className={style.loginForm}>

                        <div className={style.formGroup}>
                            <label className={style.formLabel}>Employee Code</label>
                            <div className={style.inputWrapper}>
                                <span className={style.inputIcon}>
                                    <FaUserAlt size={20} />
                                </span>
                                <input
                                    type="text"
                                    name="empCode"
                                    value={formData.empCode}
                                    onChange={handleOnChange}
                                    placeholder="Enter your employee code"
                                    className={style.formInput}
                                />

                            </div>
                            {errors.empCode && (
                                <ErrorMessage message={errors.empCode} />
                            )}
                        </div>

                        <div className={style.formGroup}>
                            <label className={style.formLabel}>Password</label>
                            <div className={style.inputWrapper}>
                                <span className={style.inputIcon}>
                                    <Lock size={20} />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleOnChange}
                                    placeholder="Enter your password"
                                    className={style.formInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={style.passwordToggle}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <ErrorMessage message={errors.password} />
                            )}
                        </div>
                        <div className={style.formOptions}>
                            <label className={style.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <a href="#" className={style.forgotLink}>Forgot Password?</a>
                        </div>
                        <button type="submit" className={style.loginButton} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className={style.spinner} />
                                    Please wait...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyOfficeLogin;
