import React, { useState } from 'react';

const StaffPortal = ({ section, leaveRequests, onUpdateStatus }) => {
    const [notes, setNotes] = useState({});

    const handleUpdate = (id, status) => {
        onUpdateStatus(id, status, notes[id] || '');
    };

    if (section === 'pending') {
        const pending = leaveRequests.filter(r => r.status === 'Pending');

        return (
            <div className="section slide-in active" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }} className="cyan-glow">
                        Pending Approvals
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        REVIEW AND MANAGE STUDENT LEAVE APPLICATIONS
                    </p>
                </div>

                {pending.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>No pending requests at the moment.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {pending.map((req) => (
                            <div key={req.id} className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{req.studentName}</h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '1px' }}>{req.regNo}</span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                                        {req.type.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reason:</p>
                                    <p style={{ fontSize: '1rem', color: 'white', lineHeight: '1.5' }}>{req.reason}</p>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Add Remark (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type advisor note..."
                                        value={notes[req.id] || ''}
                                        onChange={(e) => setNotes({ ...notes, [req.id]: e.target.value })}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(40, 199, 111, 0.1)', color: '#28c76f', border: '1px solid #28c76f' }}
                                        onClick={() => handleUpdate(req.id, 'Approved')}
                                    >
                                        APPROVE
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(234, 84, 85, 0.1)', color: '#ea5455', border: '1px solid #ea5455' }}
                                        onClick={() => handleUpdate(req.id, 'Rejected')}
                                    >
                                        REJECT
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (section === 'records') {
        return (
            <div className="section slide-in active" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }} className="cyan-glow">
                        Student Records
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        DATABASE OF STUDENT ATTENDANCE AND LEAVE RECORDS
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '0' }}>
                    <div className="table-container">
                        <table style={{ margin: '0' }}>
                            <thead>
                                <tr>
                                    <th>REGISTER NUMBER</th>
                                    <th>STUDENT NAME</th>
                                    <th>ATTENDANCE</th>
                                    <th style={{ textAlign: 'center' }}>LEAVES TAKEN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>921422104051</td>
                                    <td>Santhosh John</td>
                                    <td style={{ color: '#28c76f', fontWeight: 700 }}>92%</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                            {leaveRequests.filter(r => r.regNo === '921422104051').length}
                                        </span>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>921422104052</td>
                                    <td>Priya Dharshini</td>
                                    <td style={{ color: '#28c76f', fontWeight: 700 }}>95%</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>4</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>921422104055</td>
                                    <td>Vignesh R</td>
                                    <td style={{ color: '#ea5455', fontWeight: 700 }}>88%</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>15</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.4 }}>
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)', marginBottom: '1rem' }}></div>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>OFFICIAL STAFF PORTAL ACCESS • SECURE SESSION</p>
                </div>
            </div>
        );
    }

    return null;
};

export default StaffPortal;
