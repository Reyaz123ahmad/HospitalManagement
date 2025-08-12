
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
  FaSync,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaUser,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';

const Dashboard = () => {
  const [accountType, setAccountType] = useState(null);
  const [appointments, setAppointments] = useState({
    booked: [],
    completed: [],
    cancelled: [],
    expired: [],
  });
  const [activeTab, setActiveTab] = useState('booked');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isClick,setIsClick]=useState(false);
  
  function handleSidebarMenu(){
    setIsClick(prev => !prev); 
  } 
  useEffect(() => {
    const storedAccountType = localStorage.getItem('accountType');
    if (storedAccountType && storedAccountType !== 'null' && storedAccountType !== 'undefined') {
      setAccountType(storedAccountType.toLowerCase());
    } else {
      console.log('Account type not found in localStorage');
    }
  }, []);

  useEffect(() => {
    if (accountType && ['customer', 'admin', 'doctor'].includes(accountType)) {
      fetchAppointments();
    } else if (accountType) {
      navigate('/unauthorized');
    }
  }, [accountType]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let endpoint = 'auth/appointments';

      if (accountType === 'admin') {
        endpoint = 'auth/admin/appointments';
      } else if (accountType === 'doctor') {
        endpoint = 'auth/doctor/appointments';
      }

      const response = await axiosInstance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`auth/appointments/cancel/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error.message);
    }
  };

  const completeAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.put(`auth/appointments/complete/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error.message);
    }
  };

  const renderAppointments = (list) => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      );
    }

    if (!list || list.length === 0) {
      return (
        <div className="no-appointments">
          <div className="empty-state-icon">
            <FaUserMd size={64} />
          </div>
          <p>No appointments found</p>
        </div>
      );
    }

    return list.map((appt) => (
      <div key={appt._id} className="appointmentCard" data-status={appt.status}>
        <div className="card-header">
          <div className="doctor-avatar">
            {appt.doctor?.doctorImage ? (
              <img
                src={appt.doctor.doctorImage}
                alt={`Dr. ${appt.doctor.doctorName}`}
                className="avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="avatar-fallback">
                {appt.doctor?.doctorName?.charAt(0).toUpperCase() || 'D'}
              </div>
            )}
          </div>
          <div className="doctor-info">
            <h3>Dr. {appt.doctor?.doctorName}</h3>
            <p className="specialization">{appt.doctor?.specialization}</p>
          </div>
          <span className={`status-badge ${appt.status}`}>
            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
          </span>
        </div>

        <div className="appointment-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <div>
              <span className="detail-label">Date</span>
              <span className="detail-value">
                {new Date(appt.appointmentDateTime).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <div>
              <span className="detail-label">Time</span>
              <span className="detail-value">
                {new Date(appt.appointmentDateTime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </span>
            </div>
          </div>
          <div className="detail-item">
            <FaRupeeSign className="detail-icon" />
            <div>
              <span className="detail-label">Fee</span>
              <span className="detail-value">₹{appt.amount}</span>
            </div>
          </div>

          {(accountType === 'admin' || accountType === 'doctor') && appt.patient && (
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div>
                <span className="detail-label">Patient</span>
                <span className="detail-value">
                  {appt.patient.firstName} {appt.patient.lastName}
                </span>
                <span className="patient-email">{appt.patient.email}</span>
              </div>
            </div>
          )}
        </div>

        {accountType === 'customer' && appt.status === 'booked' && (
          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => cancelAppointment(appt._id)}>
              <FaTimes /> Cancel
            </button>
            <button className="complete-btn" onClick={() => completeAppointment(appt._id)}>
              <FaCheck /> Complete
            </button>
          </div>
        )}
      </div>
    ));
  };

  if (!accountType) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <div className="sidebarWrapper">
        {
          isClick ? (
            <>
              <Sidebar accountType={accountType} />
              <button onClick={() => setIsClick(false)} className='sidebar-close-btn'>Close Sidebar</button>
            </>
          ) : (
            <button onClick={handleSidebarMenu} className='sidebar-close-btn'>SidebarMenu</button>
          )
        }
      </div>

      <div className="mainContent">

        <div className="dashboard-header">
          <h2>Your Appointments</h2>
          <button className="refresh-btn" onClick={fetchAppointments}>
            <FaSync /> Refresh Appointments
          </button>
        </div>

        {['customer', 'admin', 'doctor'].includes(accountType) && (
          <div className="tabs">
            {['booked', 'completed', 'cancelled', 'expired'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`tab-btn ${activeTab === status ? 'activeTab' : ''}`}
                data-status={status}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="badge">{appointments[status]?.length || 0}</span>
              </button>
            ))}
          </div>
        )}

        <div className="appointmentsList">
          {renderAppointments(appointments[activeTab])}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


