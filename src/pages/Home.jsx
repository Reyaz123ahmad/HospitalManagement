// src/App.js
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaStethoscope, FaHeartbeat, FaPhone, FaCalendarCheck, FaBars, FaTimes } from 'react-icons/fa';

// Home Page Component
const Home = () => {
  const [accountType,setAccountType]=useState(null);
    useEffect(()=>{
      const storedAccountType=localStorage.getItem('accountType');
      console.log('StoredAccountType',storedAccountType)
      if(storedAccountType && storedAccountType !=="null" && storedAccountType !=="undefined"){
        setAccountType(storedAccountType)
      }else{
        console.log('Account type not found in localStorage')
      }
      //setAccountType(storedAccountType)
    },[])
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Health is Our Priority</h1>
          <p>Compassionate care for every stage of life. State-of-the-art facilities with a patient-centered approach.</p>
          <div className="hero-buttons">
            <Link to= {accountType === 'Customer'? "/services" : accountType ==='Admin' ?"#" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} className="btn primary">Our Services</Link>
            <Link to= {accountType === 'Customer'? "/doctor-list-page" : accountType ==='Admin' ?"#" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} className="btn secondary">Book Appointment</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="icon-circle">
            <FaUserMd className="icon" />
          </div>
          <h3>Expert Doctors</h3>
          <p>Board-certified specialists with years of experience in their fields.</p>
        </div>
        
        <div className="feature-card">
          <div className="icon-circle">
            <FaHospital className="icon" />
          </div>
          <h3>Modern Facilities</h3>
          <p>State-of-the-art technology for accurate diagnosis and treatment.</p>
        </div>
        
        <div className="feature-card">
          <div className="icon-circle">
            <FaHeartbeat className="icon" />
          </div>
          <h3>24/7 Emergency</h3>
          <p>Emergency department staffed by specialists 24 hours a day.</p>
        </div>
      </section>

      <section className="services-preview">
        <div className="section-header">
          <h2>Our Medical Services</h2>
          <p>Comprehensive care for all your health needs</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <FaStethoscope className="service-icon" />
            <h3>General Medicine</h3>
            <p>Preventive care and treatment for common illnesses.</p>
          </div>
          
          <div className="service-card">
            <FaHeartbeat className="service-icon" />
            <h3>Cardiology</h3>
            <p>Heart health assessment and cardiovascular care.</p>
          </div>
          
          <div className="service-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1997/1997928.png" alt="Orthopedics" className="service-icon" />
            <h3>Orthopedics</h3>
            <p>Treatment for musculoskeletal conditions and injuries.</p>
          </div>
        </div>
        
        <div className="center-button">
          <Link to= {accountType === 'Customer'? "/services" : accountType ==='Admin' ?"#" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} className="btn outline">View All Services</Link>
          <Link to={accountType === 'Customer' ? "/gallery" : accountType === "Admin" ? "#" : '/login'} onClick={(e)=>{if(accountType === "Admin") {e.preventDefault(); alert('only for customer')}}} className='btn outline'>Gallery</Link>
        </div>
      </section>
      
      <section className="testimonials">
        <div className="section-header">
          <h2>Patient Testimonials</h2>
          <p>Hear what our patients say about us</p>
        </div>
        
        <div className="testimonial-cards">
          <div className="testimonial">
            <div className="quote">"The care I received was exceptional. The staff went above and beyond to make me comfortable."</div>
            <div className="patient">
              <div className="avatar">SR</div>
              <div>
                <h4>Sarah Roberts</h4>
                <p>Cardiology Patient</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial">
            <div className="quote">"After my knee surgery, the rehabilitation team helped me get back on my feet faster than I expected."</div>
            <div className="patient">
              <div className="avatar">MJ</div>
              <div>
                <h4>Michael Johnson</h4>
                <p>Orthopedics Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home