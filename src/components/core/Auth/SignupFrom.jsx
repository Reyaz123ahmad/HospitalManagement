import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
//import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'Customer',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const { firstName, lastName, email, password, confirmPassword, accountType } = formData;

  useEffect(() => {
    let timer;
    if (resendTimer > 0 && isResendDisabled) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, isResendDisabled]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/sendotp', {
        email,
        accountType
      });
      
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        setIsResendDisabled(true);
        setResendTimer(30);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/resend-otp', { email });
      if (res.data.success) {
        toast.success("New OTP sent to your email");
        setIsResendDisabled(true);
        setResendTimer(30);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/signup', {
        ...formData,
        otp: otpValue
      });
      
      if (res.data.success) {
        toast.success("Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">
        {step === 1 ? 'Create Account' : 'Verify Email'}
      </h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {step === 1 ? (
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              Account Type <span className="required">*</span>
            </label>
            <select
              name="accountType"
              value={accountType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="submit-button"
          >
            Continue
          </button>
          
          <div className="login-redirect">
            <p className="redirect-text">
              Already have an account?{' '}
              <a href="/login" className="redirect-link">
                Log in
              </a>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="otp-form">
          <div className="otp-container">
            <p className="otp-instructions">
              We've sent a 6-digit verification code to
              <span className="otp-email"> {email}</span>
            </p>
            
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  maxLength={1}
                  className="otp-input"
                />
              ))}
            </div>
            
            <div className="resend-container">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`resend-button ${isResendDisabled ? 'disabled' : ''}`}
              >
                Resend OTP {`isResendDisabled && (${resendTimer}s)`}
              </button>
            </div>
            
            {error && (
              <p className="otp-error">{error}</p>
            )}
          </div>
          
          <div className="otp-buttons">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="back-button"
            >
              Back
            </button>
            <button
              type="submit"
              className="verify-button"
            >
              Verify
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
