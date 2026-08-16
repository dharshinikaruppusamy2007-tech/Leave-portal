import React, { useState } from 'react';

const StudentPortal = ({ section, profile, leaveRequests, onSubmitLeave }) => {
    const [formData, setFormData] = useState({ date: '', type: 'Personal', reason: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.date && formData.reason) {
            onSubmitLeave(formData);
            setFormData({ date: '', type: 'Personal', reason: '' });
        } else {
            alert('Please fill all fields');
        }
    };

    if (section === 'profile') {
        return (
            <div className="section slide-in active">
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>
                <div className="glass-card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ width: '150px', height: '150px', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: 700 }}>
                        {profile.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {Object.entries(profile.details).map(([key, value]) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>{key}</label>
                                    <p style={{ fontWeight: 500 }}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (section === 'apply') {
        return (
            <div className="section slide-in active">
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Apply Leave</h1>
                <div className="glass-card" style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Leave Date</label>
                            <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Leave Type</label>
                            <select className="form-control" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="Medical" style={{ background: '#1a2a6c' }}>Medical</option>
                                <option value="On-Duty" style={{ background: '#1a2a6c' }}>On-Duty</option>
                                <option value="Personal" style={{ background: '#1a2a6c' }}>Personal</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Reason</label>
                            <textarea className="form-control" style={{ minHeight: '120px' }} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Reason for leave..."></textarea>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Application</button>
                    </form>
                </div>
            </div>
        );
    }

    if (section === 'history') {
        const stats = [
            { label: 'TOTAL REQUESTS', value: leaveRequests.length, color: 'var(--text-color)', glow: 'var(--text-dim)' },
            { label: 'APPROVED', value: leaveRequests.filter(r => r.status === 'Approved').length, color: '#28c76f', glow: '#28c76f' },
            { label: 'REJECTED', value: leaveRequests.filter(r => r.status === 'Rejected').length, color: '#ea5455', glow: '#ea5455' },
            { label: 'ATTENDANCE', value: '92%', color: 'var(--primary-color)', glow: 'var(--primary-color)' },
        ];

        return (
            <div className="section slide-in active" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }} className="cyan-glow">
                            Academic History
                        </h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                            VIEW AND TRACK YOUR LEAVE APPLICATIONS
                        </p>
                    </div>
                </div>

                {/* Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((s, i) => (
                        <div key={i} className="stats-card" style={{ '--glow-color': s.glow }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                {s.label}
                            </span>
                            <div className="value" style={{ color: s.color }}>
                                {s.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* History Table Section */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                            Request History
                        </h2>
                        <div style={{ width: '40px', height: '2px', background: 'var(--primary-color)', opacity: 0.3 }}></div>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>CATEGORY</th>
                                    <th>ADVISOR NOTE</th>
                                    <th style={{ textAlign: 'center' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((req) => (
                                        <tr key={req.id}>
                                            <td style={{ fontWeight: 500, color: 'var(--text-color)' }}>{req.date}</td>
                                            <td>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                                                    {req.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-dim)', fontStyle: req.note === '-' ? 'italic' : 'normal', maxWidth: '300px' }}>
                                                {req.note}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`status-pill status-${req.status.toLowerCase()}`} style={{ display: 'inline-block', minWidth: '100px' }}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                            No leave requests found in history.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Subtle Footer Note */}
                <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.4 }}>
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)', marginBottom: '1rem' }}></div>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>SKYPORTAL ACADEMIC DATABASE SYSTEM</p>
                </div>
            </div>
        );
    }

    return null;
};

export default StudentPortal;
