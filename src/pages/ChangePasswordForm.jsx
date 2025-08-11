
import React, { useState } from "react";
//import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import "./ChangePassword.css"; // Make sure to create this CSS file
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const ChangePasswordForm = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return setMessage({ type: "error", text: "All fields are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return setMessage({ type: "error", text: "New passwords do not match." });
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axiosInstance.post(
        "/auth/change-password",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: "success", text: response.data.message });
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Something went wrong.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
    toast.success('Password Reset Successfully')
    navigate('/login')

  };

  return (
    <div className="change-password-container">
      <h2 className="form-title">Change Password</h2>
      <form onSubmit={handleSubmit} className="change-password-form">
        <div className="form-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>

      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ChangePasswordForm;
