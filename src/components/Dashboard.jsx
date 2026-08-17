import React from 'react';
import { ClipboardList, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

const Dashboard = ({ profile, leaveRequests }) => {
    const studentName = profile?.details?.['Full Name'] || 'Student';
    const totalRequests = leaveRequests.length;
    const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
    const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
    const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;
    const recentRequests = leaveRequests.slice(0, 5);

    return (
        <div className="sp-section">
            <div className="sp-header">
                <h1 className="sp-title">Welcome back, {studentName} </h1>
                <p className="sp-subtitle">Here is your leave and academic overview.</p>
            </div>

            <div className="sp-stats-grid">
                <div className="sp-stat-card">
                    <div className="sp-stat-icon" style={{ background: '#F1ECFA', color: '#6C4AB6' }}>
                        <ClipboardList size={22} />
                    </div>
                    <div className="sp-stat-info">
                        <span className="sp-stat-label">Total Leave Requests</span>
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
                    <div className="sp-stat-icon" style={{ background: '#FFF3E6', color: '#ff9f43' }}>
                        <Clock size={22} />
                    </div>
                    <div className="sp-stat-info">
                        <span className="sp-stat-label">Pending</span>
                        <span className="sp-stat-value">{pendingCount}</span>
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
                    <h2 className="sp-card-title">Recent Leave Applications</h2>
                </div>
                {recentRequests.length > 0 ? (
                    <div className="sp-table-wrap">
                        <table className="sp-table">
                            <thead>
                                <tr>
                                    <th>Leave Type</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRequests.map((req) => (
                                    <tr key={req._id}>
                                        <td><span className="sp-type-badge">{req.leaveType}</span></td>
                                        <td>{req.fromDate}</td>
                                        <td>{req.toDate || req.fromDate}</td>
                                        <td className="sp-reason-cell">{req.reason}</td>
                                        <td>
                                            <span className={`sp-status-badge sp-status-${req.status.toLowerCase()}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="sp-empty">
                        <FileText size={40} strokeWidth={1.2} />
                        <p>No leave applications yet.</p>
                        <span>Submit your first leave request from the Apply Leave section.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
