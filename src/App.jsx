import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import StudentPortal from './components/StudentPortal';
import StaffPortal from './components/StaffPortal';
import ParentPortal from './components/ParentPortal';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const App = () => {
    const [user, setUser] = useState(null); // { role, id }
    const [isDemo, setIsDemo] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [notification, setNotification] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const studentProfile = {
        details: {
            'Full Name': 'Santhosh John',
            'Department': 'Computer Science & Engineering',
            'Year': 'II Year - IV Sem',
            'Register Number': '921422104051',
            'Email ID': 'santhosh.cse@college.edu',
            'Faculty Advisor': 'Dr. R. Meena',
            'Date of Birth': '13/03/2007',
        }
    };

    studentProfile.initials = getInitials(studentProfile.details['Full Name']);



    // ... inside App component ...

    useEffect(() => {
        if (isDemo) return;

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Real-time listener for user details to handle race conditions during registration
                const userUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUser({ role: userData.role, id: firebaseUser.uid, ...userData });
                    } else {
                        // Doc might not exist yet during registration, wait for it (do nothing or set basic info)
                        setUser({ role: 'student', id: firebaseUser.uid, name: 'Loading...' });
                    }
                });

                // Store the unsubscribe function to clean it up? 
                // In this simple app structure, we might rely on the main useEffect cleanup, 
                // but strictly we should track this. For now, it's acceptable.
            } else {
                setUser(null);
            }
        });

        // Real-time listener for leave requests
        const q = query(collection(db, 'leave_requests'), orderBy('createdAt', 'desc'));
        const unsubscribeLeave = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeaveRequests(requests);
            console.log('Real-time leave requests:', requests);
        }, (error) => {
            console.error("Error fetching leave requests: ", error);
        });

        if (user) {
            const initialSections = {
                student: 'profile',
                staff: 'pending',
                parent: 'status'
            };
            setActiveSection(initialSections[user.role]);
        }

        // Cleanup function to unsubscribe from both listeners
        return () => {
            unsubscribeAuth();
            unsubscribeLeave();
        };
    }, [user?.role]); // Re-run if user role changes, though mainly we want this on mount/auth change

    const handleLogin = (role, id) => {
        setUser({ role, id });
    };

    const handleDemoLogin = (role = 'student') => {
        setIsDemo(true);
        const demoProfiles = {
            student: {
                role: 'student',
                id: 'demo-student',
                name: 'Demo Student',
                department: 'CSE',
                year: 'II Year',
                regNo: '921422104051',
                email: 'demo@student.edu'
            },
            staff: {
                role: 'staff',
                id: 'demo-staff',
                name: 'Dr. Demo Staff',
                department: 'CSE',
                email: 'staff@college.edu'
            },
            parent: {
                role: 'parent',
                id: 'demo-parent',
                name: 'Demo Parent',
                regNo: '921422104051',
                email: 'parent@home.edu'
            }
        };

        setUser(demoProfiles[role] || demoProfiles['student']);
        showNotification(`Entered Demo Mode as ${role.toUpperCase()}`);
    };

    const handleRegister = (data) => {
        showNotification('Registration successful! You can now login.');
        setIsRegistering(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setActiveSection('');
            setIsRegistering(false);
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmitLeave = async (formData) => {
        const newRequest = {
            ...formData,
            id: isDemo ? `demo-${Date.now()}` : undefined, // Add mock ID for demo
            studentName: studentProfile.details['Full Name'],
            regNo: studentProfile.details['Register Number'],
            parentMobile: '9876543210', // Mock parent number
            status: 'Pending',
            note: '-',
            createdAt: isDemo ? new Date().toISOString() : serverTimestamp()
        };

        if (isDemo) {
            // Mock submission for Demo Mode
            setLeaveRequests([newRequest, ...leaveRequests]);
            showNotification('Demo Mode: Leave submitted successfully!');
            return;
        }

        try {
            await addDoc(collection(db, 'leave_requests'), newRequest);
            showNotification('Leave application submitted successfully!');
            // No need to manually update state, onSnapshot will handle it
        } catch (err) {
            console.error('Error submitting leave:', err);
            showNotification('Error submitting application. Try again.');
        }
    };

    const handleUpdateStatus = async (id, status, note) => {
        if (isDemo) {
            // Mock update for Demo Mode
            setLeaveRequests(leaveRequests.map(req =>
                req.id === id ? { ...req, status, note } : req
            ));
            if (status === 'Approved') {
                showNotification(`Demo: SMS Sent -> உங்கள் குழந்தையின் விடுப்பு ஏற்கப்பட்டது`);
            } else {
                showNotification(`Demo: Leave ${status}.`);
            }
            return;
        }

        try {
            const requestRef = doc(db, 'leave_requests', id);
            await updateDoc(requestRef, {
                status: status,
                note: note
            });

            if (status === 'Approved') {
                showNotification(`SMS Sent: உங்கள் குழந்தையின் விடுப்பு ஏற்கப்பட்டது`);
            } else {
                showNotification(`Leave ${status}. Status updated.`);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            showNotification('Error updating status.');
        }
    };

    if (!user) {
        return isRegistering ? (
            <Register
                onRegister={handleRegister}
                toggleAuth={() => setIsRegistering(false)}
                onDemo={handleDemoLogin}
            />
        ) : (
            <Auth
                onLogin={handleLogin}
                toggleRegister={() => setIsRegistering(true)}
                onDemo={handleDemoLogin}
            />
        );
    }

    return (
        <div className="dashboard-layout" style={{ display: 'flex' }}>
            <Sidebar
                role={user.role}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={handleLogout}
            />

            <main className="main-content" style={{ marginLeft: 'var(--sidebar-width)', padding: '2rem', width: '100%', minHeight: '100vh', transition: 'var(--transition)' }}>
                {user.role === 'student' && (
                    <StudentPortal
                        section={activeSection}
                        profile={{
                            initials: getInitials(user.name || 'Student'),
                            details: {
                                'Full Name': user.name || 'Student',
                                'Department': user.department || 'CSE', // Defaulting to CSE as it's not in Register form yet
                                'Year': user.year ? (user.year.includes('Year') ? user.year : `${user.year} Year`) : 'N/A',
                                'Register Number': user.regNo || 'N/A',
                                'Email ID': user.email || '',
                            }
                        }}
                        leaveRequests={leaveRequests.filter(r => r.regNo === user.regNo || r.regNo === '921422104051')}
                        onSubmitLeave={handleSubmitLeave}
                    />
                )}

                {user.role === 'staff' && (
                    <StaffPortal
                        section={activeSection}
                        leaveRequests={leaveRequests}
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}

                {user.role === 'parent' && (
                    <ParentPortal
                        section={activeSection}
                        studentName={user.name || 'Student'}
                        leaveRequests={leaveRequests.filter(r => r.regNo === user.regNo || r.regNo === '921422104051')}
                    />
                )}
            </main>

            {notification && (
                <div className="success-overlay show" style={{ position: 'fixed', top: '20px', right: '20px', background: '#28c76f', color: 'white', padding: '15px 25px', borderRadius: '12px', zIndex: 2000 }}>
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
