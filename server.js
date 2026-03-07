const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Resend } = require('resend');  // ← Changed from nodemailer

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);  // ← Use Resend API key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store contacts in memory (for now)
let contacts = [];

// Handle contact form submission
app.post('/api/contact', (req, res) => {
    console.log('Received data:', req.body);
    
    const { name, email, phone, message } = req.body;
    
    // Save to array
    contacts.push({ name, email, phone, message });
    
    // Send response immediately
    res.json({ success: true, message: 'Message received!' });
    
    // Send email via Resend (fire and forget)
    resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['knazma436@gmail.com'],
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    }).then(() => {
        console.log('✅ Email sent via Resend');
    }).catch((error) => {
        console.log('❌ Error sending email:', error);
    });
});

// Get all contacts (for admin)
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});