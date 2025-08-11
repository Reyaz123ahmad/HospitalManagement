

import React, { useState } from "react";
//import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import './ResetPassword.css'
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.password || !formData.confirmPassword) {
      return setMessage({ type: "error", text: "All fields are required." });
    }

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { newPassword: formData.password }
      );
      setMessage({ type: "success", text: response.data.message });
      setFormData({ password: "", confirmPassword: "" });
      toast.success('Password Reset Successfully')
      navigate('/login')
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Password reset failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
    
    
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h2>🔒 Reset Your Password</h2>
          <p>Create a new strong password for your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "error" ? "✖" : "✓"} {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;

