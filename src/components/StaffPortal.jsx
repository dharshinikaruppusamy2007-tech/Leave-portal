import React, { useState } from 'react';

const StaffPortal = ({ section, leaveRequests, onApprove, onReject }) => {
    const [notes, setNotes] = useState({});

    if (section === 'pending') {
        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Pending Approvals</h1>
                    <p className="sp-subtitle">Review and manage student leave applications.</p>
                </div>

                {leaveRequests.length === 0 ? (
                    <div className="stp-empty">
                        <p>No pending requests at the moment.</p>
                    </div>
                ) : (
                    <div className="stp-grid">
                        {leaveRequests.map((req) => (
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
                                    <th>Register Number</th>
                                    <th>Student Name</th>
                                    <th style={{ textAlign: 'center' }}>Total Leaves</th>
                                    <th style={{ textAlign: 'center' }}>Approved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr key={s.regNo}>
                                            <td style={{ fontWeight: 600, color: '#6C4AB6' }}>{s.regNo}</td>
                                            <td>{s.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="sp-status-badge sp-status-pending">
                                                    {s.leaves}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', color: '#28c76f', fontWeight: 700 }}>{s.approved}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#6B6875' }}>
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
