import React, { useState } from 'react';
import { apiLogin } from '../api';

const Login = ({ onLoginSuccess, toggleRegister }) => {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiLogin(email, password, role);
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

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

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">ROLE</label>
                        <div className="login-select-wrapper">
                            <select
                                className="login-input login-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
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
