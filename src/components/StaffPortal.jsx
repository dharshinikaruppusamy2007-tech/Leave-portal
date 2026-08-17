import React, { useState } from 'react';

const StaffPortal = ({ section, leaveRequests, onApprove, onReject }) => {
    const [notes, setNotes] = useState({});

    if (section === 'pending') {
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

                {leaveRequests.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>No pending requests at the moment.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
                        {leaveRequests.map((req) => (
                            <div key={req._id} className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{req.studentName}</h3>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, letterSpacing: '1px' }}>
                                            {req.regNo || 'No Reg No'}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                                        {req.leaveType.toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>Department</span>
                                        <p style={{ color: 'white', marginTop: '2px' }}>{req.department || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.7rem' }}>Section</span>
                                        <p style={{ color: 'white', marginTop: '2px' }}>{req.section || 'N/A'}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                    <span>From: <span style={{ color: 'white' }}>{req.fromDate}</span></span>
                                    {req.toDate && <span>To: <span style={{ color: 'white' }}>{req.toDate}</span></span>}
                                </div>

                                <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                    Applied: {req.appliedAt ? new Date(req.appliedAt).toLocaleDateString() : 'N/A'}
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Reason:</p>
                                    <p style={{ fontSize: '0.95rem', color: 'white', lineHeight: '1.5' }}>{req.reason}</p>
                                </div>

                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rejection Reason (if rejecting)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Type rejection reason..."
                                        value={notes[req._id] || ''}
                                        onChange={(e) => setNotes({ ...notes, [req._id]: e.target.value })}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(40, 199, 111, 0.1)', color: '#28c76f', border: '1px solid #28c76f', cursor: 'pointer' }}
                                        onClick={() => onApprove(req._id)}
                                    >
                                        APPROVE
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(234, 84, 85, 0.1)', color: '#ea5455', border: '1px solid #ea5455', cursor: 'pointer' }}
                                        onClick={() => onReject(req._id, notes[req._id] || '')}
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
        const studentMap = {};
        leaveRequests.forEach(r => {
            if (r.regNo) {
                if (!studentMap[r.regNo]) {
                    studentMap[r.regNo] = { regNo: r.regNo, name: r.studentName || 'Unknown', leaves: 0, approved: 0 };
                }
                studentMap[r.regNo].leaves += 1;
                if (r.status === 'Approved') studentMap[r.regNo].approved += 1;
            }
        });
        const students = Object.values(studentMap);

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
                                    <th style={{ textAlign: 'center' }}>TOTAL LEAVES</th>
                                    <th style={{ textAlign: 'center' }}>APPROVED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr key={s.regNo} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1.2rem', fontWeight: 600, color: 'var(--primary-color)' }}>{s.regNo}</td>
                                            <td>{s.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                                    {s.leaves}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', color: '#28c76f', fontWeight: 700 }}>{s.approved}</td>
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

export default StaffPortal;
