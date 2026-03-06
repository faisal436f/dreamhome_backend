const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;  // ← IMPORTANT!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store contacts in memory (for now)
let contacts = [];

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'knazma436@gmail.com',
    pass: 'fuwv svkw wonu xxse'
  }
});

// Handle contact form submission
app.post('/api/contact', (req, res) => {
    console.log('Received data:', req.body);
    
    const { name, email, phone, message } = req.body;
    
    // Send email
    const mailOptions = {
      from: 'knazma436@gmail.com',
      to: 'knazma436@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    
    // Save to array
    contacts.push({ name, email, phone, message });
    
    // Send success response
    res.json({ success: true, message: 'Message received!' });
});
