import React from 'react';
import { ClipboardList, CheckCircle2, XCircle, FileText, CalendarDays, BookOpen } from 'lucide-react';

const AcademicHistory = ({ leaveRequests }) => {
    const totalRequests = leaveRequests.length;
    const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
    const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;

    return (
        <div className="sp-section">
            <div className="sp-header">
                <h1 className="sp-title">Academic History</h1>
                <p className="sp-subtitle">View and track your leave applications and academic record.</p>
            </div>

            <div className="sp-history-info-grid">
                <div className="sp-history-info-card">
                    <BookOpen size={18} style={{ color: '#6C4AB6' }} />
                    <div>
                        <span className="sp-history-info-label">Academic Year</span>
                        <span className="sp-history-info-value">2025 - 2026</span>
                    </div>
                </div>
                <div className="sp-history-info-card">
                    <CalendarDays size={18} style={{ color: '#6C4AB6' }} />
                    <div>
                        <span className="sp-history-info-label">Current Semester</span>
                        <span className="sp-history-info-value">IV Semester</span>
                    </div>
                </div>
                <div className="sp-history-info-card">
                    <CheckCircle2 size={18} style={{ color: '#28c76f' }} />
                    <div>
                        <span className="sp-history-info-label">Attendance</span>
                        <span className="sp-history-info-value">92%</span>
                    </div>
                </div>
            </div>

            <div className="sp-stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="sp-stat-card">
                    <div className="sp-stat-icon" style={{ background: '#F1ECFA', color: '#6C4AB6' }}>
                        <ClipboardList size={22} />
                    </div>
                    <div className="sp-stat-info">
                        <span className="sp-stat-label">Total Requests</span>
                        <span className="sp-stat-value">{totalRequests}</span>
                    </div>
                </div>
                <div className="sp-stat-card">
                    <div className="sp-stat-icon" style={{ background: '#E8F8EE', color: '#28c76f' }}>
                        <CheckCircle2 size={22} />
                    </div>
                    <div className="sp-stat-info">
                        <span className="sp-stat-label">Approved</span>
                        <span className="sp-stat-value">{approvedCount}</span>
                    </div>
                </div>
                <div className="sp-stat-card">
                    <div className="sp-stat-icon" style={{ background: '#FDECEC', color: '#ea5455' }}>
                        <XCircle size={22} />
                    </div>
                    <div className="sp-stat-info">
                        <span className="sp-stat-label">Rejected</span>
                        <span className="sp-stat-value">{rejectedCount}</span>
                    </div>
                </div>
            </div>

            <div className="sp-card">
                <div className="sp-card-header">
                    <h2 className="sp-card-title">Leave Records</h2>
                </div>
                {leaveRequests.length > 0 ? (
                    <div className="sp-table-wrap">
                        <table className="sp-table">
                            <thead>
                                <tr>
                                    <th>Leave Type</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Reason</th>
                                    <th>Advisor Note</th>
                                    <th>Status</th>
                                    <th>Applied Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveRequests.map((req) => (
                                    <tr key={req._id}>
                                        <td><span className="sp-type-badge">{req.leaveType}</span></td>
                                        <td>{req.fromDate}</td>
                                        <td>{req.toDate || req.fromDate}</td>
                                        <td className="sp-reason-cell">{req.reason}</td>
                                        <td style={{ color: '#6B6875', fontStyle: !req.reviewComment || req.reviewComment === '' ? 'italic' : 'normal' }}>{req.reviewComment || '-'}</td>
                                        <td>
                                            <span className={`sp-status-badge sp-status-${req.status.toLowerCase()}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td style={{ color: '#6B6875', fontSize: '0.85rem' }}>{req.appliedAt ? new Date(req.appliedAt).toLocaleDateString() : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="sp-empty">
                        <FileText size={40} strokeWidth={1.2} />
                        <p>No leave records found.</p>
                        <span>Your leave history will appear here once you submit applications.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicHistory;
