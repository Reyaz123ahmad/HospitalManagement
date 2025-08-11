import React, { useState } from "react";
//import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import './CreateCategoryForm.css'

export default function CreateCategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        "/doctor/createCategory", 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccessMessage("Category created successfully!");
      setFormData({ name: "", description: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error creating category";
      setErrorMessage(errorMsg);
      console.error("Error:", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="category-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create New Medical Category</h2>
          <p>Add a new specialty category to organize doctors in your system</p>
        </div>
        
        <form onSubmit={handleSubmit} className="category-form">
          {successMessage && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i> {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {errorMessage}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              id="name"
              name="name"
              placeholder="Cardiology, Pediatrics, Neurology, etc."
              value={formData.name}
              onChange={handleChange}
              required
            />
            <p className="input-hint">Enter a descriptive name for the medical specialty</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe this medical specialty (optional)"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
            <p className="input-hint">Provide additional information about this category</p>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i> Create Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
