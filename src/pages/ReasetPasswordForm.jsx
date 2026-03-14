

// import React, { useState } from "react";
// //import axios from "axios";
// import axiosInstance from "../utils/axiosInstance";
// import { useNavigate, useParams } from "react-router-dom";
// import './ResetPassword.css'
// import toast from "react-hot-toast";

// const ResetPasswordForm = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: ""
//   });
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });

//     if (!formData.password || !formData.confirmPassword) {
//       return setMessage({ type: "error", text: "All fields are required." });
//     }

//     if (formData.password !== formData.confirmPassword) {
//       return setMessage({ type: "error", text: "Passwords do not match." });
//     }

//     try {
//       setLoading(true);
//       const response = await axiosInstance.post(
//         `/auth/reset-password/${token}`,
//         { newPassword: formData.password }
//       );
//       setMessage({ type: "success", text: response.data.message });
//       setFormData({ password: "", confirmPassword: "" });
//       toast.success('Password Reset Successfully')
//       navigate('/login')
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || "Password reset failed. Please try again.";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
    
    
//   };

//   return (
//     <div className="reset-password-container">
//       <div className="reset-password-card">
//         <div className="reset-password-header">
//           <h2>🔒 Reset Your Password</h2>
//           <p>Create a new strong password for your account</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="reset-password-form">
//           <div className="form-group">
//             <label htmlFor="password">New Password</label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               disabled={loading}
//               required
//               minLength={8}
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               disabled={loading}
//               required
//               placeholder="••••••••"
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="submit-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner"></span> Resetting...
//               </>
//             ) : (
//               "Reset Password"
//             )}
//           </button>
//         </form>

//         {message.text && (
//           <div className={`message ${message.type}`}>
//             {message.type === "error" ? "✖" : "✓"} {message.text}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordForm;

import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import './ResetPassword.css';
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
  const [showPassword, setShowPassword] = useState(false); // Optional: Add show/hide password

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear message when user types
    setMessage({ type: "", text: "" });
  };

  // Optional: Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    // Optional: Add password strength validation
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setMessage({ 
        type: "error", 
        text: "Password must contain at least one uppercase letter, one lowercase letter, and one number." 
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        { newPassword: formData.password }
      );

      // Success message
      toast.success(response.data.message || 'Password Reset Successfully');
      
      // Show success message before navigating
      setMessage({ 
        type: "success", 
        text: response.data.message || "Password reset successfully! Redirecting to login..." 
      });
      
      setFormData({ password: "", confirmPassword: "" });

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Password reset failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
      toast.error(errorMsg);
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
            <div className="password-input-wrapper"> {/* Add wrapper for eye icon */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                minLength={8}
                placeholder="••••••••"
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"} {/* Or use icons */}
              </button>
            </div>
            <small className="password-hint">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="••••••••"
                className="form-input"
              />
            </div>
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
            <span className="message-icon">
              {message.type === "error" ? "❌" : "✅"}
            </span>
            {message.text}
          </div>
        )}

        {/* Optional: Link back to login */}
        <div className="back-to-login">
          <button 
            onClick={() => navigate('/login')}
            className="back-link"
            disabled={loading}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;