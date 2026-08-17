import React from 'react';

const MyProfile = ({ profile }) => {
    return (
        <div className="sp-section">
            <div className="sp-header">
                <h1 className="sp-title">My Profile</h1>
                <p className="sp-subtitle">Your personal and academic information.</p>
            </div>
            <div className="sp-card sp-profile-card">
                <div className="sp-profile-top">
                    <div className="sp-profile-avatar">
                        {profile.initials}
                    </div>
                    <div>
                        <h2 className="sp-profile-name">{profile.details?.['Full Name'] || 'Student'}</h2>
                        <p className="sp-profile-role">Student • {profile.details?.['Department'] || 'CSE'}</p>
                    </div>
                </div>
                <div className="sp-profile-divider"></div>
                <div className="sp-profile-grid">
                    {Object.entries(profile.details).map(([key, value]) => (
                        <div key={key} className="sp-profile-field">
                            <span className="sp-profile-label">{key}</span>
                            <span className="sp-profile-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
