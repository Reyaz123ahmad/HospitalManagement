
import { FaUserMd, FaHospital, FaStethoscope, FaHeartbeat, FaPhone, FaCalendarCheck, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useEffect,useState } from 'react';
// Footer Component
const Footer = () => {
  const [accountType,setAccountType]=useState(null);
    useEffect(()=>{
      const storedAccountType=localStorage.getItem('accountType');
      console.log('StoredAccountType',storedAccountType)
      if(storedAccountType && storedAccountType !=="null" && storedAccountType !=="undefined"){
          setAccountType(storedAccountType)
      }else{
          console.log('Account type not found in localStorage')
      }
    console.log(storedAccountType)
    },[])
    
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo">
              <FaHospital className="logo-icon" />
              <span>MediCare</span>
            </div>
            <p>Providing exceptional healthcare services with compassion and expertise since 1985.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to= {accountType === 'Customer'? "/about" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}}>About Us</Link></li>
              <li><Link to= {accountType === 'Customer'? "/services" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}}>Services</Link></li>
              <li><Link to= {accountType === 'Customer'? "/doctor-list-page" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}}>Our Doctors</Link></li>
              <li><Link to= {accountType === 'Customer'? "/contact" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}}>Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Our Services</h3>
            <ul>
              <li><Link to="/services/cardiology">Cardiology</Link></li>
              <li><Link to="/services/orthopedics">Orthopedics</Link></li>
              <li><Link to="/services/neurology">Neurology</Link></li>
              <li><Link to="/services/pediatrics">Pediatrics</Link></li>
              <li><Link to="/services/oncology">Oncology</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Medical Drive, Health City, HC 54321</span>
              </li>
              <Link to="tel:(123) 456-7890">
                <li>
                  <i className="fas fa-phone"></i>
                  <span>(123) 456-7890</span>
                </li>
              </Link>
              <Link to="mailto:info@medicarehospital.com">
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@medicarehospital.com</span>
                </li>
              </Link>
              <li>
                <i className="fas fa-clock"></i>
                <span>Mon-Fri: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MediCare Hospital. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer
