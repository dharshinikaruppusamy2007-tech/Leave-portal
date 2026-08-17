import React, { useState } from 'react';
import { apiRegister } from '../api';

const Register = ({ onRegister, toggleAuth }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [regNo, setRegNo] = useState('');
    const [year, setYear] = useState('');
    const [department, setDepartment] = useState('');
    const [section, setSection] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const data = await apiRegister({
                name,
                email,
                password,
                role,
                regNo,
                year,
                department,
                section,
                mobile
            });
            onRegister(data.user);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-decor-circle login-decor-circle-1"></div>
            <div className="login-decor-circle login-decor-circle-2"></div>

            <div className="login-card" style={{ maxWidth: '540px' }}>
                <div className="login-header">
                    <div className="login-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8.5" cy="7" r="4" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 8V14M23 11H17" stroke="#6C4AB6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="login-title" style={{ fontSize: '1.5rem' }}>REGISTER</h1>
                    <p className="login-subtitle">JOIN <span className="login-subtitle-bold">LEAVE</span> PORTAL</p>
                </div>

                {error && (
                    <div style={{ background: '#FDECEC', color: '#ea5455', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">FULL NAME</label>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <div className="login-field" style={{ flex: 1 }}>
                            <label className="login-label">REGISTER NO</label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Register number"
                                value={regNo}
                                onChange={(e) => setRegNo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-field" style={{ flex: 1 }}>
                            <label className="login-label">YEAR</label>
                            <div className="login-select-wrapper">
                                <select
                                    className="login-input login-select"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                >
                                    <option value="">Select year</option>
                                    <option value="I">I Year</option>
                                    <option value="II">II Year</option>
                                    <option value="III">III Year</option>
                                    <option value="IV">IV Year</option>
                                </select>
                                <svg className="login-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9L12 15L18 9" stroke="#6B6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <div className="login-field" style={{ flex: 1 }}>
                            <label className="login-label">DEPARTMENT</label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="e.g. CSE"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        </div>
                        <div className="login-field" style={{ flex: 1 }}>
                            <label className="login-label">SECTION</label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="e.g. A"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">MOBILE NUMBER</label>
                        <input
                            type="tel"
                            className="login-input"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
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
                        <label className="login-label">ROLE</label>
                        <div className="login-select-wrapper">
                            <select
                                className="login-input login-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="student">Student Module</option>
                                <option value="staff">Staff Module</option>
                            </select>
                            <svg className="login-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9L12 15L18 9" stroke="#6B6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">PASSWORD</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn login-btn-primary" disabled={loading}>
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>

                    <button type="button" onClick={toggleAuth} className="login-btn login-btn-secondary">
                        BACK TO LOGIN
                    </button>

                    <p className="login-register">
                        ALREADY HAVE AN ACCOUNT?{' '}
                        <span className="login-register-link" onClick={toggleAuth}>
                            LOGIN
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
