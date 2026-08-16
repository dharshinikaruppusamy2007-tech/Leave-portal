import React from 'react';
import { User, Send, History, Clock, Users, Info, List, LogOut } from 'lucide-react';

const Sidebar = ({ role, activeSection, setActiveSection, onLogout }) => {
    const menuItems = {
        student: [
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
        <aside className="sidebar slide-in">
            <div className="sidebar-logo">
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', color: 'white' }}>SkyPortal</h2>
            </div>

            <nav className="sidebar-menu">
                {menuItems[role].map((item) => (
                    <div key={item.id} className="menu-item" style={{ marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => setActiveSection(item.id)}
                            className={`menu-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span className="menu-label">{item.label}</span>
                        </button>
                    </div>
                ))}
            </nav>

            <button className="menu-link logout-btn" onClick={onLogout} style={{ marginTop: 'auto', color: '#ff4757', border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <LogOut size={20} />
                <span className="menu-label">Logout</span>
            </button>

            <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          position: fixed;
          left: 0;
          top: 0;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--glass-border);
          z-index: 100;
        }
        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          text-decoration: none;
          color: var(--text-dim);
          border-radius: 12px;
          transition: var(--transition);
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
        }
        .menu-link i, .menu-link svg {
          margin-right: 15px;
          width: 20px;
          text-align: center;
        }
        .menu-link:hover, .menu-link.active {
          background: var(--glass-bg);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        @media (max-width: 992px) {
          .sidebar { width: 80px; padding: 2rem 0.5rem; }
          .menu-label { display: none; }
          .sidebar-logo h2 { display: none; }
          .menu-link { justify-content: center; }
          .menu-link svg { margin-right: 0; }
        }
      `}</style>
        </aside>
    );
};

export default Sidebar;
