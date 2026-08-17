import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyProfile from './components/MyProfile';
import ApplyLeave from './components/ApplyLeave';
import AcademicHistory from './components/AcademicHistory';
import StaffPortal from './components/StaffPortal';
import ParentPortal from './components/ParentPortal';
import {
  isLoggedIn,
  apiGetProfile,
  apiGetMyLeaveRequests,
  apiGetPendingLeaves,
  apiSubmitLeave,
  apiApproveLeave,
  apiRejectLeave,
  apiLogout
} from './api';

const App = () => {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [notification, setNotification] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [authChecked, setAuthChecked] = useState(false);

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const loadProfile = useCallback(async () => {
        try {
            const profile = await apiGetProfile();
            setUser(profile);
            return profile;
        } catch {
            apiLogout();
            setUser(null);
            return null;
        }
    }, []);

    const loadLeaveRequests = useCallback(async (role) => {
        try {
            if (role === 'staff') {
                const data = await apiGetPendingLeaves();
                setLeaveRequests(data);
            } else {
                const data = await apiGetMyLeaveRequests();
                setLeaveRequests(data);
            }
        } catch {
            setLeaveRequests([]);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            if (isLoggedIn()) {
                const profile = await loadProfile();
                if (profile) {
                    await loadLeaveRequests(profile.role);
                }
            }
            setAuthChecked(true);
        };
        init();
    }, [loadProfile, loadLeaveRequests]);

    useEffect(() => {
        if (user) {
            const initialSections = {
                student: 'dashboard',
                staff: 'pending',
                parent: 'status'
            };
            setActiveSection(initialSections[user.role]);
        }
    }, [user?.role]);

    const handleLoginSuccess = async (userData) => {
        setUser(userData);
        await loadLeaveRequests(userData.role);
    };

    const handleRegister = async (userData) => {
        showNotification('Registration successful! You can now login.');
        setUser(userData);
        await loadLeaveRequests(userData.role);
    };

    const handleLogout = () => {
        apiLogout();
        setUser(null);
        setActiveSection('');
        setIsRegistering(false);
        setLeaveRequests([]);
    };

    const handleSubmitLeave = async (formData) => {
        try {
            await apiSubmitLeave(formData);
            showNotification('Leave application submitted successfully!');
            await loadLeaveRequests(user.role);
        } catch (err) {
            showNotification(err.message || 'Error submitting application. Try again.');
        }
    };

    const handleApproveLeave = async (id) => {
        try {
            await apiApproveLeave(id);
            showNotification('Leave approved.');
            await loadLeaveRequests(user.role);
        } catch (err) {
            showNotification(err.message || 'Error approving leave.');
        }
    };

    const handleRejectLeave = async (id, reviewComment) => {
        try {
            await apiRejectLeave(id, reviewComment);
            showNotification('Leave rejected.');
            await loadLeaveRequests(user.role);
        } catch (err) {
            showNotification(err.message || 'Error rejecting leave.');
        }
    };

    if (!authChecked) {
        return (
            <div className="login-wrapper">
                <div style={{ margin: 'auto', textAlign: 'center', color: '#6B6875' }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return isRegistering ? (
            <Register
                onRegister={handleRegister}
                toggleAuth={() => setIsRegistering(false)}
            />
        ) : (
            <Login
                onLoginSuccess={handleLoginSuccess}
                toggleRegister={() => setIsRegistering(true)}
            />
        );
    }

    const studentProfile = {
        initials: getInitials(user.name || 'Student'),
        details: {
            'Full Name': user.name || 'Not provided',
            'Register Number': user.regNo || 'Not provided',
            'Department': user.department || 'Not provided',
            'Year': user.year ? (user.year.includes('Year') ? user.year : `${user.year} Year`) : 'Not provided',
            'Section': user.section || 'Not provided',
            'Email ID': user.email || 'Not provided',
            'Mobile Number': user.mobile || 'Not provided',
        }
    };

    return (
        <div className="dashboard-layout" style={{ display: 'flex' }}>
            <Sidebar
                role={user.role}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={handleLogout}
            />

            <main className="main-content" style={{ marginLeft: 'var(--sidebar-width)', padding: '2rem', width: '100%', minHeight: '100vh', transition: 'var(--transition)' }}>
                {user.role === 'student' && activeSection === 'dashboard' && (
                    <Dashboard profile={studentProfile} leaveRequests={leaveRequests} />
                )}
                {user.role === 'student' && activeSection === 'profile' && (
                    <MyProfile profile={studentProfile} />
                )}
                {user.role === 'student' && activeSection === 'apply' && (
                    <ApplyLeave onSubmitLeave={handleSubmitLeave} />
                )}
                {user.role === 'student' && activeSection === 'history' && (
                    <AcademicHistory leaveRequests={leaveRequests} />
                )}

                {user.role === 'staff' && (
                    <StaffPortal
                        section={activeSection}
                        leaveRequests={leaveRequests}
                        onApprove={handleApproveLeave}
                        onReject={handleRejectLeave}
                    />
                )}

                {user.role === 'parent' && (
                    <ParentPortal
                        section={activeSection}
                        studentName={user.name || 'Student'}
                        department={user.department || 'Not provided'}
                        year={user.year || 'Not provided'}
                        leaveRequests={leaveRequests}
                    />
                )}
            </main>

            {notification && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#6C4AB6', color: 'white', padding: '15px 25px', borderRadius: '12px', zIndex: 2000, fontSize: '0.88rem', fontWeight: 500, boxShadow: '0 4px 16px rgba(108, 74, 182, 0.3)' }}>
                    {notification}
                </div>
            )}

            <style jsx>{`
        @media (max-width: 992px) {
          .main-content {
            margin-left: 80px !important;
          }
        }
        @media (max-width: 600px) {
          .main-content {
            margin-left: 0 !important;
            padding-bottom: 80px !important;
          }
        }
      `}</style>
        </div >
    );
};

export default App;
