import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import './Contact.css';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/doctor/createContact', formData) 
        
        if(response.data.success){
          alert(response.data.message || 'Thank you for contacting us!');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
        });
        
      }else{
        alert(response.data.error || "Something went wrong please try again")
      }
    }catch(error){
      console.error("Contact form submission error:", error.message);

      toast.error('server error please try again later')
    }
    console.log(formData)
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p>We're here to help and answer any questions you might have</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <h3>Our Location</h3>
            <p>123 Medical Center Drive</p>
            <p>Health City, HC 54321</p>
          </div>
          
          <div className="info-card">
            <h3>Contact Information</h3>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Emergency:</strong> (123) 456-7891</p>
            <p><strong>Email:</strong> contact@hospitalname.com</p>
          </div>
          
          <div className="info-card">
            <h3>Operating Hours</h3>
            <p><strong>Monday-Friday:</strong> 8:00 AM - 8:00 PM</p>
            <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM</p>
            <p><strong>Sunday:</strong> 9:00 AM - 1:00 PM</p>
            <p><strong>Emergency:</strong> 24/7</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  placeholder="1234567890"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
                placeholder="Your message here..."
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
