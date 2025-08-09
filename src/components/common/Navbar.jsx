
import React, { useState,useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';
import ProfileIcon from '../../pages/ProfileIcon';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Branding */}
        <div className="navbar-brand">
          <div className="logo-container">
            <div className="hospital-logo-placeholder"></div>
          </div>
          <div className="brand-text">
            <h1>MediCare Hospital</h1>
            <p>Compassionate Care Since 1995</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          
          <NavLink className="nav-link" to="/" exact activeClassName="active">
            Home
          </NavLink>
          <NavLink className="nav-link" to= {accountType === 'Customer'? "/about" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault();  alert('only for customer')}}} activeClassName={accountType === 'Admin' ? '' : 'active'}>
            About Us
          </NavLink>
          <NavLink className="nav-link" to= {accountType === 'Customer'? "/services" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} activeClassName={accountType === 'Admin' ? '' : 'active'}>
            Services
          </NavLink>
          <NavLink className="nav-link" to= {accountType === 'Customer'? "/doctor-list-page" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} activeClassName={accountType === 'Admin' ? '' : 'active'}>
            Doctors
          </NavLink>
          <NavLink className="nav-link" to= {accountType === 'Customer'? "/contact" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} activeClassName={accountType === 'Admin' ? '' : 'active'}>
            Contact
          </NavLink>
          
          
          <div className="nav-buttons">
            <Link to= {accountType === 'Customer'? "/doctor-list-page" : accountType ==='Admin' ?"" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} className='appointment-btn'>
              Book Appointment
            </Link>
            <div className='auth-buttons'>
              {
                accountType ? (
                  
                  <ProfileIcon accountType={accountType} setAccountType={setAccountType}/>
                ):(
                  <>
                    <Link to="/login" className='login-btn'>Login</Link>
                    <Link to="/signup" className='signup-btn'>Sign Up</Link>
                  </>
                )
              }

            </div>

          </div>

        </div>

        {/* Mobile Menu Button */}
        <button className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isMenuOpen ? 'bar1-open' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'bar2-open' : ''}`}></div>
          <div className={`bar ${isMenuOpen ? 'bar3-open' : ''}`}></div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

