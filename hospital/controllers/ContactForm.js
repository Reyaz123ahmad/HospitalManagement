// controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');

const ContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      message
    });

    await newMessage.save();
    res.status(201).json({success:true, message: 'Your message has been received. Thank you!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

module.exports = { ContactForm };
