import React, { useState } from 'react';

const ApplyLeave = ({ onSubmitLeave }) => {
    const [formData, setFormData] = useState({ date: '', endDate: '', type: 'Personal', reason: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.date && formData.reason) {
            onSubmitLeave({ date: formData.date, endDate: formData.endDate, type: formData.type, reason: formData.reason });
            setFormData({ date: '', endDate: '', type: 'Personal', reason: '' });
        } else {
            alert('Please fill all fields');
        }
    };

    return (
        <div className="sp-section">
            <div className="sp-header">
                <h1 className="sp-title">Apply Leave</h1>
                <p className="sp-subtitle">Submit a new leave application.</p>
            </div>
            <div className="sp-card" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="sp-form-group">
                        <label className="sp-form-label">Leave Type</label>
                        <div className="sp-select-wrap">
                            <select
                                className="sp-input sp-select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Medical">Medical</option>
                                <option value="On-Duty">On-Duty</option>
                                <option value="Personal">Personal</option>
                            </select>
                            <svg className="sp-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9L12 15L18 9" stroke="#6B6875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="sp-form-row">
                        <div className="sp-form-group" style={{ flex: 1 }}>
                            <label className="sp-form-label">From Date</label>
                            <input
                                type="date"
                                className="sp-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="sp-form-group" style={{ flex: 1 }}>
                            <label className="sp-form-label">To Date</label>
                            <input
                                type="date"
                                className="sp-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="sp-form-group">
                        <label className="sp-form-label">Reason</label>
                        <textarea
                            className="sp-input sp-textarea"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Describe your reason for leave..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="sp-btn sp-btn-primary" style={{ width: '100%' }}>
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
