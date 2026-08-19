import React, { useState } from 'react';

const StaffPortal = ({ section, leaveRequests, onApprove, onReject }) => {
    const [notes, setNotes] = useState({});

    if (section === 'pending') {
        const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending');

        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Pending Approvals</h1>
                    <p className="sp-subtitle">Review and manage student leave applications.</p>
                </div>

                {pendingLeaves.length === 0 ? (
                    <div className="stp-empty">
                        <p>No pending requests at the moment.</p>
                    </div>
                ) : (
                    <div className="stp-grid">
                        {pendingLeaves.map((req) => (
                            <div key={req._id} className="stp-approval-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 className="sp-profile-name">{req.studentName}</h3>
                                        <span className="sp-profile-label">{req.regNo || 'No Reg No'}</span>
                                    </div>
                                    <span className="sp-type-badge">{req.leaveType}</span>
                                </div>

                                <div className="sp-profile-divider" style={{ marginBottom: '1rem' }} />

                                <div className="stp-info-grid">
                                    <div className="sp-profile-field">
                                        <span className="sp-profile-label">Department</span>
                                        <span className="sp-profile-value">{req.department || 'N/A'}</span>
                                    </div>
                                    <div className="sp-profile-field">
                                        <span className="sp-profile-label">Section</span>
                                        <span className="sp-profile-value">{req.section || 'N/A'}</span>
                                    </div>
                                    <div className="sp-profile-field">
                                        <span className="sp-profile-label">From Date</span>
                                        <span className="sp-profile-value">{req.fromDate || 'N/A'}</span>
                                    </div>
                                    <div className="sp-profile-field">
                                        <span className="sp-profile-label">To Date</span>
                                        <span className="sp-profile-value">{req.toDate || 'N/A'}</span>
                                    </div>
                                    <div className="sp-profile-field">
                                        <span className="sp-profile-label">Applied Date</span>
                                        <span className="sp-profile-value">{req.appliedAt ? new Date(req.appliedAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="sp-profile-divider" style={{ margin: '1rem 0' }} />

                                <div className="stp-reason-section">
                                    <p className="stp-reason-label">Reason</p>
                                    <p className="stp-reason-value">{req.reason}</p>
                                </div>

                                <div className="stp-reject-group">
                                    <label className="stp-reject-label">Rejection Reason (if rejecting)</label>
                                    <input
                                        type="text"
                                        className="stp-reject-input"
                                        placeholder="Type rejection reason..."
                                        value={notes[req._id] || ''}
                                        onChange={(e) => setNotes({ ...notes, [req._id]: e.target.value })}
                                    />
                                </div>

                                <div className="stp-actions">
                                    <button
                                        className="stp-btn stp-btn-approve"
                                        onClick={() => onApprove(req._id)}
                                    >
                                        APPROVE
                                    </button>
                                    <button
                                        className="stp-btn stp-btn-reject"
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
        const getDays = (from, to) => {
            if (!from || !to) return from ? 1 : 0;
            const diff = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
            return diff > 0 ? diff : 1;
        };

        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Student Records</h1>
                    <p className="sp-subtitle">Database of student attendance and leave records.</p>
                </div>

                <div className="stp-records-card">
                    <div className="sp-table-wrap">
                        <table className="sp-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Register Number</th>
                                    <th>Department</th>
                                    <th>Section</th>
                                    <th>Leave Type</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th style={{ textAlign: 'center' }}>Days</th>
                                    <th>Reason</th>
                                    <th>Applied Date</th>
                                    <th style={{ textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.length > 0 ? (
                                    leaveRequests.map((r) => (
                                        <tr key={r._id}>
                                            <td style={{ fontWeight: 600 }}>{r.studentName || 'Unknown'}</td>
                                            <td style={{ fontWeight: 600, color: '#6C4AB6' }}>{r.regNo || 'N/A'}</td>
                                            <td>{r.department || 'N/A'}</td>
                                            <td>{r.section || 'N/A'}</td>
                                            <td><span className="sp-type-badge">{r.leaveType}</span></td>
                                            <td>{r.fromDate || 'N/A'}</td>
                                            <td>{r.toDate || r.fromDate || 'N/A'}</td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{getDays(r.fromDate, r.toDate)}</td>
                                            <td className="sp-reason-cell">{r.reason}</td>
                                            <td style={{ color: '#6B6875', fontSize: '0.85rem' }}>{r.appliedAt ? new Date(r.appliedAt).toLocaleDateString() : 'N/A'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`sp-status-badge sp-status-${r.status.toLowerCase()}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: '#6B6875' }}>
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
