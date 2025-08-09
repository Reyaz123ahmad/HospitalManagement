
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DoctorList.css";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name");

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/doctor/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDoctors(res.data.data);
    } catch (err) {
      console.error("Error fetching doctors:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Get unique categories for filter dropdown
  const categories = [...new Set(doctors.map(doc => doc.category?.name || "Uncategorized"))];
  
  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter(doc => {
      const matchesSearch = doc.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || 
                            (doc.category?.name === categoryFilter) || 
                            (categoryFilter === "Uncategorized" && !doc.category);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.doctorName.localeCompare(b.doctorName);
      } else if (sortOption === "fee-low") {
        return a.consultationFee - b.consultationFee;
      } else if (sortOption === "fee-high") {
        return b.consultationFee - a.consultationFee;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="doctor-list-container">
      <div className="header-section">
        <h1>Find Your Doctor</h1>
        <p>Browse our network of experienced healthcare professionals</p>
      </div>
      
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        
        <div className="filter-group">
          <label>Filter by Specialty:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Specialties</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Sort by:</label>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="fee-low">Fee (Low to High)</option>
            <option value="fee-high">Fee (High to Low)</option>
          </select>
        </div>
      </div>
      
      {filteredDoctors.length === 0 ? (
        <div className="no-results">
          <h3>No doctors found</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={() => {setSearchTerm(""); setCategoryFilter("all")}}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="doctor-grid">
          {filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <div className="card-header">
                <div className="doctor-avatar">
                  {/* {doc.doctorName.charAt(0)} */}
                  <img src={doc.doctorImage} alt="" className="doctor-img"/>
                </div>
                <div className="doctor-info">
                  <h3>{doc.doctorName}</h3>
                  <p className="specialty">{doc.category?.name || "General Practitioner"}</p>
                </div>
              </div>
              
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Specialization:</span>
                  <span className="detail-value">{doc.specialization}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Consultation Fee:</span>
                  <span className="detail-value fee">₹{doc.consultationFee}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{doc.experience || "5+"} years</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button className="btn-view-profile">View Profile</button>
                <Link to={`/booking?doctor_id=${doc._id}&date=${new Date().toISOString().slice(0, 10)}&time=10:00`} ><button className="btn-book">Book Appointment</button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="results-count">
        Showing {filteredDoctors.length} of {doctors.length} doctors
      </div>
    </div>
  );
}



