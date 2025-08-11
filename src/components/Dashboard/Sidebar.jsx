import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import History from './History';
import Delete from './Setting/Delete';
import './Sidebar.css'

const Sidebar = ({ accountType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = accountType?.toLowerCase() === "admin";
  const isDoctor = accountType?.toLowerCase() === "doctor";
  
  // Navigation items
  const adminItems = [
    { path: "/add-doctor", label: "Add Doctor", icon: "fas fa-user-md" },
    { path: "/create-category", label: "Create Category", icon: "fas fa-tag" },
    { path: "/doctor-management", label: "Manage Doctors", icon: "fas fa-clipboard-list" }
  ];
  
  const userItems = [
    { path: "/doctor-list-page", label: "Book Appointment", icon: "fas fa-calendar-check" },
    { path: "/dashboard", label: "My Appointments", icon: "fas fa-history" }
  ];

  const doctorItems = [
    { path: "/dashboard", label: "My Appointments", icon: "fas fa-calendar-check" },
    { path: "/doctor-schedule", label: "My Schedule", icon: "fas fa-calendar-alt" },
    { path: "/doctor-profile", label: "My Profile", icon: "fas fa-id-card" }
  ];

  const commonItems = [
    { component: <History key="history" />, label: "History", icon: "fas fa-history" },
    { component: <Delete key="delete" />, label: "Account Settings", icon: "fas fa-cog" }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Get panel type text
  const getPanelType = () => {
    if (isAdmin) return "Admin Panel";
    if (isDoctor) return "Doctor Panel";
    return "Customer Panel";
  };

  // Get user type text
  const getUserType = () => {
    if (isAdmin) return "Administrator";
    if (isDoctor) return "Doctor";
    return "Patient";
  };

  // Get section title
  const getSectionTitle = () => {
    if (isAdmin) return "Administration";
    if (isDoctor) return "Doctor Services";
    return "Patient Services";
  };

  // Get navigation items based on account type
  const getNavItems = () => {
    if (isAdmin) return adminItems;
    if (isDoctor) return doctorItems;
    return userItems;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (isAdmin) return "Admin User";
    if (isDoctor) return "Dr. Name"; // In a real app, you'd fetch the actual doctor name
    return "Patient";
  };

  // Get user role description
  const getUserRole = () => {
    if (isAdmin) return "System Administrator";
    if (isDoctor) return "Medical Professional";
    return "Registered Patient";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleSidebar}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="hospital-logo">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="hospital-info">
              <h3>MediCare Hospital</h3>
              <p>{getPanelType()}</p>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          {/* User Type Indicator */}
          <div className="user-type-badge">
            <i className="fas fa-user-shield"></i>
            {getUserType()}
          </div>

          {/* Navigation Links */}
          <div className="sidebar-section">
            <h4 className="section-title">
              {getSectionTitle()}
            </h4>
            
            <ul className="nav-links">
              {getNavItems().map((item) => (
                <li 
                  key={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <Link to={item.path} onClick={() => setIsOpen(false)}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Components */}
          <div className="sidebar-section">
            <h4 className="section-title">Account</h4>
            
            <ul className="nav-links">
              {commonItems.map((item, index) => (
                <li key={index}>
                  <div className="component-item">
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.component}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="forgot-password">
          <Link to="/change-password" className="forgot-link">
            <i className='fas fa-lock'></i>
            <span>Change Password</span>
          </Link>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-details">
              <p className="username">{getUserDisplayName()}</p>
              <p className="user-role">{getUserRole()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;




