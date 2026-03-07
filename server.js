const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store contacts in memory (for now)
let contacts = [];

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle contact form submission
app.post('/api/contact', (req, res) => {
    console.log('Received data:', req.body);
    
    const { name, email, phone, message } = req.body;
    
    // ✅ Save to array FIRST
    contacts.push({ name, email, phone, message });
    
    // ✅ Send response IMMEDIATELY (before email)
    res.json({ success: true, message: 'Message received!' });
    
    // ✅ Send email AFTER response (don't wait for it)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        // ✅ Don't send response here - already sent above!
      } else {
        console.log('Email sent:', info.response);
      }
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

