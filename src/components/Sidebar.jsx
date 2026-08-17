import React from 'react';
import { LayoutDashboard, User, Send, History, Clock, Users, Info, List, LogOut } from 'lucide-react';

const Sidebar = ({ role, activeSection, setActiveSection, onLogout }) => {
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
            { id: 'status', label: 'Status', icon: <Info size={20} /> },
            { id: 'detailed', label: 'Detailed History', icon: <List size={20} /> },
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
