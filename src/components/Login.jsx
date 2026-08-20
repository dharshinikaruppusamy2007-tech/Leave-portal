import React, { useState, useEffect, useRef } from 'react';
import { apiLogin, apiParentSendOTP, apiParentVerifyOTP } from '../api';

const Login = ({ onLoginSuccess, toggleRegister }) => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [otpStep, setOtpStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [otpExpiry, setOtpExpiry] = useState(0);
    const [linkedStudents, setLinkedStudents] = useState([]);
    const [resendCooldown, setResendCooldown] = useState(0);
    const timerRef = useRef(null);
    const resendTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (resendTimerRef.current) clearInterval(resendTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (otpExpiry > 0) {
            timerRef.current = setInterval(() => {
                setOtpExpiry(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [otpExpiry > 0]);

    useEffect(() => {
        if (resendCooldown > 0) {
            resendTimerRef.current = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(resendTimerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(resendTimerRef.current);
        }
    }, [resendCooldown > 0]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiParentSendOTP(mobile);
            setLinkedStudents(data.linkedStudents || []);
            setOtpStep(2);
            setOtpExpiry(data.expirySeconds || 300);
            setResendCooldown(60);
        } catch (err) {
            setError(err.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setOtp('');
        setLoading(true);

        try {
            const data = await apiParentSendOTP(mobile);
            setLinkedStudents(data.linkedStudents || []);
            setOtpExpiry(data.expirySeconds || 300);
            setResendCooldown(60);
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiParentVerifyOTP(mobile, otp);
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message || 'Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToMobile = () => {
        setOtpStep(1);
        setOtp('');
        setError('');
        setLinkedStudents([]);
        setOtpExpiry(0);
        setResendCooldown(0);
        if (timerRef.current) clearInterval(timerRef.current);
        if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiLogin(email, password, role);
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (role === 'parent') {
        return (
            <div className="login-wrapper">
                <div className="login-decor-circle login-decor-circle-1"></div>
                <div className="login-decor-circle login-decor-circle-2"></div>

                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 14L15 9L10 4" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 9H3" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="login-title">PARENT LOGIN</h1>
                        <p className="login-subtitle"><span className="login-subtitle-bold">LEAVE</span> PORTAL</p>
                    </div>

                    {error && (
                        <div style={{ background: '#FDECEC', color: '#ea5455', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div className="login-field">
                        <label className="login-label">ROLE</label>
                        <div className="login-select-wrapper">
                            <select
                                className="login-input login-select"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    setError('');
                                    setOtpStep(1);
                                    setOtp('');
                                    setMobile('');
                                }}
                            >
                                <option value="student">Student Module</option>
                                <option value="staff">Staff Module</option>
                                <option value="parent">Parent Module</option>
                            </select>
                            <svg className="login-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9L12 15L18 9" stroke="#6B6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    {otpStep === 1 ? (
                        <form onSubmit={handleSendOTP}>
                            <div className="login-field">
                                <label className="login-label">PARENT MOBILE NUMBER</label>
                                <input
                                    type="tel"
                                    className="login-input"
                                    placeholder="Enter 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    required
                                    maxLength={10}
                                />
                            </div>

                            <button type="submit" className="login-btn login-btn-primary" disabled={loading || mobile.length !== 10}>
                                {loading ? 'SENDING OTP...' : 'SEND OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP}>
                            {linkedStudents.length > 0 && (
                                <div style={{ background: '#F1ECFA', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.82rem', color: '#3B285F' }}>
                                    <strong>Linked student(s):</strong> {linkedStudents.map(s => `${s.name} (${s.regNo || 'No Reg No'})`).join(', ')}
                                </div>
                            )}

                            <div className="login-field">
                                <label className="login-label">OTP SENT TO {mobile}</label>
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    maxLength={6}
                                    autoFocus
                                />
                            </div>

                            {otpExpiry > 0 && (
                                <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.82rem', color: '#6B6875' }}>
                                    OTP expires in <strong style={{ color: otpExpiry <= 60 ? '#ea5455' : '#6C4AB6' }}>{formatTimer(otpExpiry)}</strong>
                                </div>
                            )}

                            {otpExpiry === 0 && (
                                <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.82rem', color: '#ea5455', fontWeight: 600 }}>
                                    OTP has expired. Please request a new one.
                                </div>
                            )}

                            <button type="submit" className="login-btn login-btn-primary" disabled={loading || otp.length !== 6 || otpExpiry === 0}>
                                {loading ? 'VERIFYING...' : 'VERIFY OTP'}
                            </button>

                            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
                                <button
                                    type="button"
                                    className="login-btn login-btn-secondary"
                                    onClick={handleBackToMobile}
                                    style={{ flex: 1 }}
                                >
                                    CHANGE NUMBER
                                </button>
                                <button
                                    type="button"
                                    className="login-btn login-btn-secondary"
                                    onClick={handleResendOTP}
                                    disabled={loading || resendCooldown > 0}
                                    style={{ flex: 1 }}
                                >
                                    {resendCooldown > 0 ? `RESEND (${formatTimer(resendCooldown)})` : 'RESEND OTP'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-decor-circle login-decor-circle-1"></div>
            <div className="login-decor-circle login-decor-circle-2"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14L15 9L10 4" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 9H3" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="login-title">LOGIN</h1>
                    <p className="login-subtitle"><span className="login-subtitle-bold">LEAVE</span> PORTAL</p>
                </div>

                {error && (
                    <div style={{ background: '#FDECEC', color: '#ea5455', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleStudentSubmit}>
                    <div className="login-field">
                        <label className="login-label">ROLE</label>
                        <div className="login-select-wrapper">
                            <select
                                className="login-input login-select"
                                value={role}
                                onChange={(e) => { setRole(e.target.value); setError(''); }}
                            >
                                <option value="student">Student Module</option>
                                <option value="staff">Staff Module</option>
                                <option value="parent">Parent Module</option>
                            </select>
                            <svg className="login-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9L12 15L18 9" stroke="#6B6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">EMAIL ID</label>
                        <input
                            type="email"
                            className="login-input"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">PASSWORD</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn login-btn-primary" disabled={loading}>
                        {loading ? 'AUTHORIZING...' : 'AUTHORIZE'}
                    </button>

                    {role === 'student' && (
                        <p className="login-register">
                            DON'T HAVE AN ACCOUNT?{' '}
                            <span className="login-register-link" onClick={toggleRegister}>
                                REGISTER
                            </span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
