import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { FaUserAlt } from "react-icons/fa";
import style from '../../Style/Login/Login.module.css';
import { images } from '../../../../assets/css/imagePath';
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage';
import * as loginAction from '../../Action/Login/LoginAction';
import { useNavigate } from 'react-router-dom';

const MyOfficeLogin = () => {
    const [formData, setFormData] = useState({ empCode: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPopup, setShowForgotPopup] = useState(false);
    const [forgotEmpCode, setForgotEmpCode] = useState('');
    const [forgotError, setForgotError] = useState('');
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        loginAction.handleChange(e, setFormData, setErrors);
    }

    const onSubmit = (e) => {
        loginAction.handleSubmit(e, setIsLoading, formData, setErrors, navigate);
    }

    const handleForgetSubmit = () => {
        loginAction.onForgotSubmit(forgotEmpCode, setForgotError);
    }

    const handleClose = () => {
        setShowForgotPopup(false);
        setForgotEmpCode('');
        setForgotError('');
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
                            <span
                                className={style.forgotLink}
                                onClick={() => setShowForgotPopup(true)}
                                role="button"
                                tabIndex={0}
                            >
                                Forgot Password?
                            </span>


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

            {showForgotPopup && (
                <div className={style.popupOverlay}>
                    <div className={style.popupContainer}>
                        <div className={style.popupHeader}>
                            <h5>Forgot Password</h5>
                            <span className={style.closeBtn} onClick={handleClose} >
                                <X size={20} />
                            </span>
                        </div>

                        <div className={style.popupBody}>
                            <div className={style.inputWrapper}>
                                <span className={style.inputIcon}>
                                    <FaUserAlt size={16} />
                                </span>
                                <input type="text" value={forgotEmpCode} onChange={(e) => setForgotEmpCode(e.target.value)} placeholder="Enter your employee code" className={style.formInput} />
                            </div>
                            {forgotError && <ErrorMessage message={forgotError} />}

                            <button className={style.loginButton} onClick={handleForgetSubmit} >
                                Get Password
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default MyOfficeLogin;
