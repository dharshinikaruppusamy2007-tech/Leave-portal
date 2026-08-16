const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock Database (In-memory)
let leaveRequests = [
    {
        id: 1,
        date: '2026-01-10',
        type: 'Personal',
        reason: 'Temple Visit',
        status: 'Approved',
        note: 'Approved',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    },
    {
        id: 2,
        date: '2026-01-15',
        type: 'Medical',
        reason: 'Regular Checkup',
        status: 'Approved',
        note: 'Take care',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    },
    {
        id: 3,
        date: '2026-01-20',
        type: 'Personal',
        reason: 'Family Function',
        status: 'Approved',
        note: 'Enjoy the function',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    },
    {
        id: 4,
        date: '2026-01-25',
        type: 'Medical',
        reason: 'Fever and cold',
        status: 'Approved',
        note: 'Get well soon',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    },
    {
        id: 5,
        date: '2026-01-28',
        type: 'On-Duty',
        reason: 'Sports Meet',
        status: 'Rejected',
        note: 'Academic priority',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    },
    {
        id: 6,
        date: '2026-02-05',
        type: 'On-Duty',
        reason: 'Symposium at IIT',
        status: 'Pending',
        note: '-',
        studentName: 'Santhosh John',
        regNo: '921422104051',
        parentMobile: '9876543210'
    }
];

// SMS GATEWAY CONFIGURATION (Fast2SMS)
// IMPORTANT: Replace with your actual Fast2SMS API Key
const FAST2SMS_API_KEY = 'YOUR_FAST2SMS_API_KEY_HERE';

app.get('/api/leave-requests', (req, res) => {
    res.json(leaveRequests);
});

app.post('/api/submit-leave', (req, res) => {
    const newRequest = {
        id: Date.now(),
        ...req.body,
        status: 'Pending',
        note: '-'
    };
    leaveRequests.unshift(newRequest);
    res.json({ success: true, request: newRequest });
});

app.post('/api/update-status', async (req, res) => {
    const { id, status, note } = req.body;
    const index = leaveRequests.findIndex(r => r.id === id);

    if (index !== -1) {
        leaveRequests[index].status = status;
        leaveRequests[index].note = note;

        let smsStatus = 'Not Sent';

        // Trigger SMS only for Approval
        if (status === 'Approved') {
            const student = leaveRequests[index];
            const studentName = student.studentName || 'Student';
            const parentMobile = student.parentMobile || '9876543210';

            // Tamil Message Content (Unicode)
            const tamilMessage = `மாணவர் ${studentName} அவர்களின் விடுப்பு விண்ணப்பம் அங்கீகரிக்கப்பட்டுள்ளது. - கல்லூரி நிர்வாகம்`;

            try {
                const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                    params: {
                        authorization: FAST2SMS_API_KEY,
                        route: 'v3',
                        sender_id: 'TXTIND',
                        message: tamilMessage,
                        language: 'unicode',
                        numbers: parentMobile
                    }
                });

                if (response.data && response.data.return) {
                    smsStatus = 'Sent Successfully';
                    console.log(`[SMS] Tamil SMS sent to ${parentMobile} for student ${studentName}`);
                } else {
                    smsStatus = 'Fast2SMS Error: ' + JSON.stringify(response.data);
                    console.error('[SMS] Failed to send SMS:', response.data);
                }
            } catch (error) {
                smsStatus = 'Network Error';
                console.error('[SMS] API Error:', error.message);
            }
        }

        res.json({
            success: true,
            request: leaveRequests[index],
            smsStatus: smsStatus
        });
    } else {
        res.status(404).json({ success: false, message: 'Request not found' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`SkyPortal Backend running on port ${PORT}`);
    console.log(`Ready for Real-time Approvals & SMS`);
    console.log(`========================================\n`);
});
