import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Register = ({ onRegister, toggleAuth, onDemo }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [password, setPassword] = useState('');
    const [regNo, setRegNo] = useState('');
    const [year, setYear] = useState('');
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const glow = document.querySelector('.ambient-glow');
        if (!glow) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        const handleGlobalMove = (e) => {
            if (e.touches) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        };

        const animate = () => {
            glowX += (mouseX - glowX) * 0.05;
            glowY += (mouseY - glowY) * 0.05;
            if (glow) {
                glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchmove', handleGlobalMove);
        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();

        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        setTilt({ x: y * -1, y: x * 1 });
    };

    const handleTouchMove = (e) => {
        const { clientX, clientY } = e.touches[0];
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();

        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        setTilt({ x: y * -1, y: x * 1 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role,
                regNo,
                year,
                createdAt: new Date().toISOString()
            });

            onRegister({ name, email, role, password, regNo, year });
        } catch (err) {
            console.error('Registration error:', err);
            console.log('Firebase registration failed, falling back to Demo Mode');
            onDemo(role);
        }
    };

    const fireflies = [...Array(15)].map((_, i) => (
        <div key={i} className="firefly" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3000 + 5000}ms` }}></div>
    ));

    return (
        <div className="login-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem', overflow: 'hidden', position: 'relative' }}>
            <div className="cyber-grid" style={{ zIndex: 0 }}></div>
            {fireflies}
            <div className="ambient-glow" style={{ zIndex: 0 }}></div>

            <div
                className="animated-border-box tilt-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseLeave}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    zIndex: 10,
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform 0.1s ease-out'
                }}
            >
                <div
                    className="trapezium-card"
                    style={{
                        padding: '1rem 1.5rem',
                        width: '100%'
                    }}
                >
                    <div className="card-header" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1.5px solid rgba(0, 229, 255, 0.5)', background: 'rgba(255, 255, 255, 0.02)', boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <h1 style={{ fontSize: '1.3rem', marginBottom: '0.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: '#fff' }} className="cyan-glow login-header-font">
                            REGISTER
                        </h1>
                        <p className="app-name-font" style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '2px', marginTop: '0.2rem' }}>
                            JOIN <span className="cyan-text app-name-font">LEAVE</span> PORTAL
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                            <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                FULL NAME
                            </label>
                            <div className="cyber-input-wrapper">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Your Name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Register No & Year - 2 Column Row */}
                        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.6rem' }}>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    REGISTER NO
                                </label>
                                <div className="cyber-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Reg No..."
                                        value={regNo}
                                        onChange={(e) => setRegNo(e.target.value)}
                                        style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                    YEAR
                                </label>
                                <div className="cyber-input-wrapper">
                                    <select
                                        className="form-control"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                        required
                                    >
                                        <option value="" style={{ background: '#020617' }}>Year</option>
                                        <option value="I" style={{ background: '#020617' }}>I</option>
                                        <option value="II" style={{ background: '#020617' }}>II</option>
                                        <option value="III" style={{ background: '#020617' }}>III</option>
                                        <option value="IV" style={{ background: '#020617' }}>IV</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                            <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                EMAIL ID
                            </label>
                            <div className="cyber-input-wrapper">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="email@address.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                            <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                SELECT ROLE
                            </label>
                            <div className="cyber-input-wrapper">
                                <select
                                    className="form-control"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                >
                                    <option value="student" style={{ background: '#020617' }}>STUDENT MODULE</option>
                                    <option value="staff" style={{ background: '#020617' }}>STAFF MODULE</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="label-font" style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                                PASSWORD
                            </label>
                            <div className="cyber-input-wrapper">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.75rem', padding: '6px 10px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="cyber-input-wrapper" style={{ marginBottom: '0.6rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.6rem', letterSpacing: '3px', fontSize: '0.75rem', background: 'rgba(0, 229, 255, 0.1)' }}>
                                CREATE ACCOUNT
                            </button>
                        </div>

                        <div className="cyber-input-wrapper">
                            <button type="button" onClick={toggleAuth} className="btn-secondary" style={{ width: '100%', padding: '0.6rem', letterSpacing: '2px', fontSize: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s' }}>
                                BACK TO LOGIN
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
