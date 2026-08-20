import React from 'react';
import { LayoutDashboard, User, Send, History, Clock, Users, Info, List, LogOut, Bell } from 'lucide-react';

const Sidebar = ({ role, activeSection, setActiveSection, onLogout, unreadCount }) => {
    const menuItems = {
        student: [
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
            { id: 'apply', label: 'Apply Leave', icon: <Send size={20} /> },
            { id: 'history', label: 'Academic History', icon: <History size={20} /> },
        ],
        staff: [
            { id: 'pending', label: 'Pending Approvals', icon: <Clock size={20} /> },
            { id: 'records', label: 'Student Records', icon: <Users size={20} /> },
        ],
        parent: [
            { id: 'status', label: 'Ward Status', icon: <Info size={20} /> },
            { id: 'history', label: 'Leave History', icon: <List size={20} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
        ],
    };

    return (
        <aside className="sp-sidebar">
            <div className="sp-sidebar-logo">
                <div className="sp-sidebar-logo-icon">S</div>
                <span className="sp-sidebar-logo-text">SkyPortal</span>
            </div>

            <nav className="sp-sidebar-nav">
                {menuItems[role].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`sp-sidebar-link ${activeSection === item.id ? 'sp-sidebar-active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.id === 'notifications' && unreadCount > 0 && (
                            <span style={{
                                marginLeft: 'auto',
                                background: '#ea5455',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                borderRadius: '50%',
                                minWidth: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 4px'
                            }}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <button className="sp-sidebar-link sp-sidebar-logout" onClick={onLogout}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
