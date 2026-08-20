import React, { useState, useEffect, useCallback } from 'react';
import { apiGetParentWards, apiGetParentLeaves, apiGetParentNotifications, apiMarkNotificationRead, apiMarkAllNotificationsRead } from '../api';

const ParentPortal = ({ section }) => {
    const [wards, setWards] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWard, setSelectedWard] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [wardsData, leavesData, notifData] = await Promise.all([
                apiGetParentWards(),
                apiGetParentLeaves(),
                apiGetParentNotifications()
            ]);
            setWards(wardsData);
            setLeaves(leavesData);
            setNotifications(notifData);
            if (wardsData.length > 0 && !selectedWard) {
                setSelectedWard(wardsData[0]._id);
            }
        } catch (err) {
            console.error('Failed to load parent data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (section === 'notifications' || section === 'status' || section === 'history') {
            loadData();
        }
    }, [section, loadData]);

    const currentWard = wards.find(w => w._id === selectedWard);
    const wardLeaves = selectedWard ? leaves.filter(l => String(l.studentId) === String(selectedWard)) : leaves;
    const allWardLeaves = leaves;

    const getDays = (from, to) => {
        if (!from || !to) return from ? 1 : 0;
        const diff = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : 1;
    };

    const handleMarkRead = async (notifId) => {
        try {
            await apiMarkNotificationRead(notifId);
            setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await apiMarkAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    if (loading) {
        return (
            <div className="sp-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <p style={{ color: '#6B6875', fontSize: '0.95rem' }}>Loading...</p>
            </div>
        );
    }

    if (wards.length === 0) {
        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Parent Dashboard</h1>
                    <p className="sp-subtitle">Welcome to the Leave Portal.</p>
                </div>
                <div className="sp-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>&#128100;</div>
                    <p style={{ color: '#3B285F', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>No Ward Found</p>
                    <p style={{ color: '#6B6875', fontSize: '0.85rem', margin: 0 }}>
                        No student is linked to your mobile number. Please ask your ward to register with your mobile number in the Parent/Guardian Mobile field.
                    </p>
                </div>
            </div>
        );
    }

    if (section === 'status') {
        const pendingLeaves = wardLeaves.filter(r => r.status === 'Pending');
        const approvedLeaves = wardLeaves.filter(r => r.status === 'Approved');
        const rejectedLeaves = wardLeaves.filter(r => r.status === 'Rejected');
        const totalLeaves = wardLeaves.length;

        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Ward Status</h1>
                    <p className="sp-subtitle">View your ward's leave status and information.</p>
                </div>

                {wards.length > 1 && (
                    <div className="sp-card" style={{ marginBottom: '1.5rem' }}>
                        <label className="sp-form-label">SELECT WARD</label>
                        <div className="sp-select-wrap">
                            <select
                                className="sp-input sp-select"
                                value={selectedWard || ''}
                                onChange={(e) => setSelectedWard(e.target.value)}
                            >
                                {wards.map(w => (
                                    <option key={w._id} value={w._id}>{w.name} - {w.regNo || 'No Reg No'}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {currentWard && (
                    <div className="sp-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="sp-profile-top">
                            <div className="sp-profile-avatar">
                                {currentWard.name ? currentWard.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
                            </div>
                            <div>
                                <h2 className="sp-profile-name">{currentWard.name}</h2>
                                <p className="sp-profile-role">Student</p>
                            </div>
                        </div>
                        <div className="sp-profile-divider" />
                        <div className="sp-profile-grid">
                            <div className="sp-profile-field">
                                <span className="sp-profile-label">Register Number</span>
                                <span className="sp-profile-value">{currentWard.regNo || 'Not provided'}</span>
                            </div>
                            <div className="sp-profile-field">
                                <span className="sp-profile-label">Department</span>
                                <span className="sp-profile-value">{currentWard.department || 'Not provided'}</span>
                            </div>
                            <div className="sp-profile-field">
                                <span className="sp-profile-label">Year</span>
                                <span className="sp-profile-value">{currentWard.year || 'Not provided'}</span>
                            </div>
                            <div className="sp-profile-field">
                                <span className="sp-profile-label">Section</span>
                                <span className="sp-profile-value">{currentWard.section || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sp-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon" style={{ background: '#F1ECFA' }}>
                            <span style={{ color: '#6C4AB6', fontSize: '1.2rem', fontWeight: 700 }}>{totalLeaves}</span>
                        </div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Total Leaves</span>
                            <span className="sp-stat-value">{totalLeaves}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon" style={{ background: '#FFF3E6' }}>
                            <span style={{ color: '#ff9f43', fontSize: '1.2rem', fontWeight: 700 }}>{pendingLeaves.length}</span>
                        </div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Pending</span>
                            <span className="sp-stat-value">{pendingLeaves.length}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon" style={{ background: '#E8F8EE' }}>
                            <span style={{ color: '#28c76f', fontSize: '1.2rem', fontWeight: 700 }}>{approvedLeaves.length}</span>
                        </div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Approved</span>
                            <span className="sp-stat-value">{approvedLeaves.length}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon" style={{ background: '#FDECEC' }}>
                            <span style={{ color: '#ea5455', fontSize: '1.2rem', fontWeight: 700 }}>{rejectedLeaves.length}</span>
                        </div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Rejected</span>
                            <span className="sp-stat-value">{rejectedLeaves.length}</span>
                        </div>
                    </div>
                </div>

                {wardLeaves.length === 0 ? (
                    <div className="sp-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                        <p style={{ color: '#6B6875', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>No leave records found for this ward.</p>
                    </div>
                ) : (
                    <div className="sp-card">
                        <div className="sp-card-header">
                            <h3 className="sp-card-title">Recent Leave Applications</h3>
                        </div>
                        <div className="sp-table-wrap">
                            <table className="sp-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Applied</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wardLeaves.slice(0, 10).map(r => (
                                        <tr key={r._id}>
                                            <td><span className="sp-type-badge">{r.leaveType}</span></td>
                                            <td>{r.fromDate || 'N/A'}</td>
                                            <td>{r.toDate || r.fromDate || 'N/A'}</td>
                                            <td style={{ fontWeight: 600 }}>{getDays(r.fromDate, r.toDate)}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                                            <td style={{ color: '#6B6875', fontSize: '0.85rem' }}>{r.appliedAt ? new Date(r.appliedAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <span className={`sp-status-badge sp-status-${r.status.toLowerCase()}`}>{r.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (section === 'history') {
        return (
            <div className="sp-section">
                <div className="sp-header">
                    <h1 className="sp-title">Leave History</h1>
                    <p className="sp-subtitle">Complete leave archive for your ward(s).</p>
                </div>

                {wards.length > 1 && (
                    <div className="sp-card" style={{ marginBottom: '1.5rem' }}>
                        <label className="sp-form-label">SELECT WARD</label>
                        <div className="sp-select-wrap">
                            <select
                                className="sp-input sp-select"
                                value={selectedWard || ''}
                                onChange={(e) => setSelectedWard(e.target.value)}
                            >
                                {wards.map(w => (
                                    <option key={w._id} value={w._id}>{w.name} - {w.regNo || 'No Reg No'}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {wardLeaves.length === 0 ? (
                    <div className="sp-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                        <p style={{ color: '#6B6875', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>No leave records found.</p>
                    </div>
                ) : (
                    <div className="sp-card">
                        <div className="sp-table-wrap">
                            <table className="sp-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Reg No</th>
                                        <th>Dept</th>
                                        <th>Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Applied</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wardLeaves.map(r => (
                                        <tr key={r._id}>
                                            <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                                            <td style={{ color: '#6C4AB6', fontWeight: 600 }}>{r.regNo || 'N/A'}</td>
                                            <td>{r.department || 'N/A'}</td>
                                            <td><span className="sp-type-badge">{r.leaveType}</span></td>
                                            <td>{r.fromDate || 'N/A'}</td>
                                            <td>{r.toDate || r.fromDate || 'N/A'}</td>
                                            <td style={{ fontWeight: 600 }}>{getDays(r.fromDate, r.toDate)}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason}</td>
                                            <td style={{ color: '#6B6875', fontSize: '0.85rem' }}>{r.appliedAt ? new Date(r.appliedAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <span className={`sp-status-badge sp-status-${r.status.toLowerCase()}`}>{r.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (section === 'notifications') {
        const unreadCount = notifications.filter(n => !n.read).length;

        const getStatusIcon = (status) => {
            switch (status) {
                case 'Approved': return { emoji: '\u2705', color: '#28c76f', bg: '#E8F8EE' };
                case 'Rejected': return { emoji: '\u274C', color: '#ea5455', bg: '#FDECEC' };
                case 'Pending': return { emoji: '\u23F3', color: '#ff9f43', bg: '#FFF3E6' };
                default: return { emoji: '\u2139', color: '#6B6875', bg: '#F1ECFA' };
            }
        };

        return (
            <div className="sp-section">
                <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="sp-title">Notifications</h1>
                        <p className="sp-subtitle">Leave status updates for your ward(s). (English + Tamil)</p>
                    </div>
                    {unreadCount > 0 && (
                        <button className="sp-btn sp-btn-primary" onClick={handleMarkAllRead} style={{ height: '36px', fontSize: '0.78rem', padding: '0 16px', whiteSpace: 'nowrap' }}>
                            Mark All Read ({unreadCount})
                        </button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="sp-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>&#128276;</div>
                        <p style={{ color: '#3B285F', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>No Notifications</p>
                        <p style={{ color: '#6B6875', fontSize: '0.85rem', margin: 0 }}>
                            Notifications will appear here when leave status changes.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notifications.map(notif => {
                            const statusInfo = getStatusIcon(notif.status);
                            const dateStr = notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                            return (
                                <div
                                    key={notif._id}
                                    className="sp-card"
                                    style={{
                                        borderLeft: `4px solid ${statusInfo.color}`,
                                        background: notif.read ? '#ffffff' : '#FAF8FE',
                                        cursor: notif.read ? 'default' : 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => !notif.read && handleMarkRead(notif._id)}
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: statusInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                            {statusInfo.emoji}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1F1F29' }}>
                                                    Leave {notif.status} / {notif.status === 'Approved' ? 'அனுமதிக்கப்பட்டது' : notif.status === 'Rejected' ? 'நிராகரிக்கப்பட்டது' : 'காத்திருக்கிறது'}
                                                </h4>
                                                <span style={{ fontSize: '0.75rem', color: '#A8A4B3', whiteSpace: 'nowrap' }}>{dateStr}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student</span>
                                                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#1F1F29' }}>{notif.studentName}</p>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reg No</span>
                                                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#6C4AB6' }}>{notif.regNo || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B6875', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leave</span>
                                                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 500, color: '#1F1F29' }}>{notif.fromDate} {notif.toDate && notif.toDate !== notif.fromDate ? `- ${notif.toDate}` : ''}</p>
                                                </div>
                                            </div>
                                            <div style={{ background: '#F8F7FC', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                                                <p style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', color: '#1F1F29', lineHeight: 1.5 }}>
                                                    <strong>English:</strong> {notif.messageEn}
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1F1F29', lineHeight: 1.5 }}>
                                                    <strong>Tamil:</strong> {notif.messageTa}
                                                </p>
                                            </div>
                                            {!notif.read && (
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6C4AB6', background: '#F1ECFA', padding: '2px 8px', borderRadius: '4px' }}>UNREAD</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return null;
};

export default ParentPortal;
