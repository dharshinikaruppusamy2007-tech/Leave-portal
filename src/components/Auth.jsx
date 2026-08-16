import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Auth = ({ onLogin, toggleRegister, onDemo }) => {
    console.log("Auth Component Rendered - Rotating Border Active");
    const [role, setRole] = useState('student');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const glow = document.querySelector('.ambient-glow');
        if (!glow) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        const handleMove = (e) => {
            if (e.touches) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        };

        const animate = () => {
            // Smooth glow movement
            glowX += (mouseX - glowX) * 0.05;
            glowY += (mouseY - glowY) * 0.05;
            if (glow) {
                glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, id, password);
            // App.jsx listener will handle state update
        } catch (err) {
            console.error('Login error:', err);
            // Auto-fallback to Demo Mode for testing if Firebase fails
            console.log('Firebase login failed, falling back to Demo Mode');
            onDemo(role);
        }
    };

    const fireflies = [...Array(15)].map((_, i) => (
        <div key={i} className="firefly" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3000 + 5000}ms` }}></div>
    ));

    return (
        <div className="login-container fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem', background: 'var(--bg-dark)', overflow: 'hidden' }}>
            {/* Background Effects */}
            <div className="cyber-grid"></div>
            {fireflies}
            <div className="ambient-glow"></div>

            <div className="trapezium-card" style={{ width: '100%', maxWidth: '370px', padding: '1.8rem 2rem', zIndex: 1 }}>
                <div className="card-header" style={{ marginBottom: '1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1.5px solid rgba(0, 229, 255, 0.5)', background: 'rgba(255, 255, 255, 0.02)', boxShadow: '0 0 15px rgba(0, 229, 255, 0.2)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateX(-1px) translateY(1px)' }}>
                                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '4px', color: '#fff' }} className="cyan-glow login-header-font">
                        LOGIN
                    </h1>
                    <p className="app-name-font" style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', marginTop: '0.5rem' }}>
                        <span className="cyan-text app-name-font">LEAVE</span> PORTAL
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="label-font" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            ROLE
                        </label>
                        <div className="cyber-input-wrapper">
                            <select
                                className="form-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.8rem', padding: '10px 14px' }}
                            >
                                <option value="student" style={{ background: '#020617' }}>STUDENT MODULE</option>
                                <option value="staff" style={{ background: '#020617' }}>STAFF MODULE</option>
                                <option value="parent" style={{ background: '#020617' }}>PARENT MODULE</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="label-font" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            {role === 'parent' ? 'MOBILE' : 'EMAIL ID'}
                        </label>
                        <div className="cyber-input-wrapper">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="INPUT..."
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.8rem', padding: '10px 14px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="label-font" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            PASSWORD
                        </label>
                        <div className="cyber-input-wrapper">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ background: 'rgba(2, 6, 23, 0.9)', borderRadius: '3px', fontSize: '0.8rem', padding: '10px 14px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="cyber-input-wrapper" style={{ marginBottom: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem', letterSpacing: '2px', fontSize: '0.8rem' }}>
                            AUTHORIZE
                        </button>
                    </div>

                    <div className="cyber-input-wrapper">
                        <button type="button" onClick={() => onDemo(role)} className="btn-secondary" style={{ width: '100%', padding: '0.8rem', letterSpacing: '2px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                            ENTER AS GUEST
                        </button>
                    </div>

                    <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                        <p className="footer-font" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                            DON'T HAVE AN ACCOUNT? <span className="cyan-text toggle-link link-font" onClick={toggleRegister} style={{ cursor: 'pointer', fontWeight: 600 }}>REGISTER</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
