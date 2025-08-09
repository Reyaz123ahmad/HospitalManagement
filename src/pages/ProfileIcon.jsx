import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Profile.css'

const ProfileIcon = ({ accountType, setAccountType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="profile-container" ref={dropdownRef}>
      <button 
        className={`profile-icon-button ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown}
      >
        {isOpen ? <FaTimes size={18} /> : <FaUser size={18} />}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <Link 
            to="/dashboard" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <span className="item-text">Dashboard</span>
          </Link>
          
          <Link 
            to="/login" 
            className="dropdown-item"
            onClick={() => {
              localStorage.removeItem('accountType');
              setAccountType(null);
              setIsOpen(false);
            }}
          >
            <span className="item-text">Logout</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;




