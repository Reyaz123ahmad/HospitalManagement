
import LoginForm from "./LoginForm";
import SignupForm from './SignupFrom'
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

function Template({ title, description1, description2, formType }) {
  const [loading] = useState(false);

  return (
    <div className="template-container">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="template-wrapper">
          <div className="form-container">
            <div className="auth-header">
              <h1 className="template-title">{title}</h1>
              <p className="template-description">
                <span className="description-part">{description1}</span>{" "}
                <span className="description-highlight">{description2}</span>
              </p>
            </div>
            
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
            
            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">or</span>
              <div className="divider-line"></div>
            </div>
            
            <button className="google-button">
              <FcGoogle className="google-icon" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="graphic-container">
            <div className="graphic-background">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
              <div className="circle circle-4"></div>
            </div>
            <div className="graphic-content">
              <div className="health-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="graphic-title">Secure Health Portal</h3>
              <p className="graphic-description">Your medical data is protected with bank-grade encryption</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;

