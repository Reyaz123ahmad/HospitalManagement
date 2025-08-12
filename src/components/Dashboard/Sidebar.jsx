



import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { FaTrash } from 'react-icons/fa';

import './Sidebar.css';

const Sidebar = ({ accountType }) => {
  const location = useLocation();

  const isAdmin = accountType?.toLowerCase() === "admin";
  const isDoctor = accountType?.toLowerCase() === "doctor";

  const navItems = isAdmin
    ? [
        { path: "/add-doctor", label: "Add Doctor +", icon: "fas fa-user-md" },
        { path: "/create-category", label: "Create Category", icon: "fas fa-tag" }
      ]
    : isDoctor
    ? [
        { path: "/dashboard", label: "MyAppointments", icon: "fas fa-calendar-check" },
        { path: "/doctor-schedule", label: "My Schedule", icon: "fas fa-calendar-alt" },
        { path: "/doctor-profile", label: "My Profile", icon: "fas fa-id-card" }
      ]
    : [
        { path: "/doctor-list-page", label: "BookAppointment", icon: "fas fa-calendar-check" },
        { path: "/dashboard", label: "MyAppointments", icon: "fas fa-history" }
      ];

  return (
    <div className="sidebarWrapper">
      {/* Header */}


      <div className="hospital-sidebar-info">
        <h3>MediCare Hospital</h3>
        <p>{isAdmin ? "Admin Panel" : isDoctor ? "Doctor Panel" : "Customer Panel"}</p>
      </div>
        
      

      {/* Navigation */}
      <div className="sidebar-section">
        
          {navItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} className='link-item'>
                
                {item.label}
              </Link>
            </li>
          ))}

      </div>

      
      <div className="delete-account">
        <Link to="/delete-account" className="delete-link">
          

          <button className='account-delete-btn'>Delete Account <FaTrash /></button>
        </Link>
        
        <Link to="/change-password" className="forgot-link">
            
          <button className='change-password-btn'>Change Password</button>
        </Link>
        
      </div>

      

      {/* Footer */}
      <div className="sidebar-footer">
        
        <div className="user-details">
          <p className="username">{isAdmin ? "Admin User" : isDoctor ? "Doctor" : ""}</p>
          <p className="user-role">{isAdmin ? "System Administrator" : isDoctor ? "Medical Professional" : "Registered Patient"}</p>
        </div>
      </div>
    </div>

    

  );
};

export default Sidebar;


