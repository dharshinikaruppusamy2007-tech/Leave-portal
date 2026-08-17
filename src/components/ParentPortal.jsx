import React from 'react';

const ParentPortal = ({ section, studentName, department, year, leaveRequests }) => {
    if (section === 'status') {
        const lastApproved = [...leaveRequests].reverse().find(r => r.status === 'Approved');
        const today = new Date().toISOString().split('T')[0];
        const isOnLeave = lastApproved && lastApproved.fromDate === today;

        return (
            <div className="section slide-in active">
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }} className="cyan-glow">
                        Leave Status
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        REAL-TIME TRACKING FOR PARENTS
                    </p>
                </div>

                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                            {studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{studentName}</h2>
                            <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>{department || 'Not provided'} | {year || 'Not provided'}</p>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Attendance</label>
                                    <p style={{ color: '#28c76f', fontWeight: 700, fontSize: '1.2rem' }}>92%</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Leaves</label>
                                    <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.2rem' }}>{leaveRequests.filter(r => r.status === 'Approved').length}</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: isOnLeave ? '#ff9f43' : '#28c76f' }}>
                                {isOnLeave ? '...' : 'OK'}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                {isOnLeave ? 'On Approved Leave' : 'In College'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (section === 'detailed') {
        return (
            <div className="section slide-in active">
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.5rem' }} className="cyan-glow">
                        Detailed History
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        COMPLETE LEAVE ARCHIVE
                    </p>
                </div>
                <div className="glass-card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((req) => (
                                        <tr key={req._id}>
                                            <td>{req.fromDate}</td>
                                            <td>{req.leaveType}</td>
                                            <td>{req.reason}</td>
                                            <td>
                                                <span className={`status-pill status-${req.status.toLowerCase()}`}>{req.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                            No student records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ParentPortal;
