
// import React, { useState } from "react"
// //import axios from "axios"
// import axiosInstance from "../utils/axiosInstance"
// import './ForgotPassword.css'

// const ForgotPasswordForm = () => {
//   const [email, setEmail] = useState("")
//   const [feedback, setFeedback] = useState({ type: "", message: "" })
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     setFeedback({ type: "", message: "" })

//     if (!email.trim()) {
//       setFeedback({ type: "error", message: "Please enter your email address." })
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       const { data } = await axiosInstance.post(
//         "/auth/forgot-password",
//         { email }
//       )
//       setFeedback({ type: "success", message: data.message })
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "An unexpected error occurred. Please try again."
//       setFeedback({ type: "error", message: errorMessage })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="centered-container">
//       <section className="form-card">
//         <h2 className="form-title">Forgot Your Password?</h2>
//         <p className="form-description">
//           Enter your registered email address and we’ll send you a reset link.
//         </p>

//         <form onSubmit={handleSubmit} className="form" noValidate>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="form-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isSubmitting}
//               required
//               placeholder="you@example.com"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="form-button"
//           >
//             {isSubmitting ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>

//         {feedback.message && (
//           <div
//             className={`form-feedback form-feedback--${feedback.type}`}
//             role={feedback.type === "error" ? "alert" : "status"}
//           >
//             {feedback.message}
//           </div>
//         )}
//       </section>
//     </div>
//   )
// }

// export default ForgotPasswordForm
import React, { useState } from "react"
import { useNavigate } from "react-router-dom" // Add for navigation
import axiosInstance from "../utils/axiosInstance"
import './ForgotPassword.css'
import { toast } from "react-hot-toast" // Optional: Add toast notifications

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [feedback, setFeedback] = useState({ type: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate() // For redirecting after success

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: "", message: "" })

    // Trim email first
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setFeedback({ 
        type: "error", 
        message: "Please enter your email address." 
      })
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setFeedback({ 
        type: "error", 
        message: "Please enter a valid email address." 
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      console.log("Sending request to:", "/auth/forgot-password") // Debug log
      
      const { data } = await axiosInstance.post(
        "/auth/forgot-password",
        { email: trimmedEmail }
      )
      
      // Success feedback
      setFeedback({ 
        type: "success", 
        message: data.message || "Password reset link sent to your email!" 
      })
      
      // Optional: Show toast notification
      toast.success("Reset link sent! Check your email.")
      
      // Clear email field
      setEmail("")
      
      // Optional: Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
      
    } catch (error) {
      console.error("Forgot password error:", error) // Debug log
      
      // Better error message extraction
      const errorMessage = 
        error.response?.data?.message || 
        error.message ||
        "Failed to send reset link. Please try again."
      
      setFeedback({ type: "error", message: errorMessage })
      
      // Optional: Show toast error
      toast.error(errorMessage)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit(e)
    }
  }

  return (
    <div className="centered-container">
      <section className="form-card">
        <h2 className="form-title">Forgot Your Password?</h2>
        <p className="form-description">
          Enter your registered email address and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${feedback.type === "error" ? "input-error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Clear feedback when user types
                if (feedback.type) setFeedback({ type: "", message: "" })
              }}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              required
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`form-button ${isSubmitting ? "button-loading" : ""}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {feedback.message && (
          <div
            className={`form-feedback form-feedback--${feedback.type}`}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            <span className="feedback-icon">
              {feedback.type === "error" ? "❌" : "✅"}
            </span>
            {feedback.message}
          </div>
        )}

        {/* Back to login link */}
        <div className="back-to-login">
          <button 
            onClick={() => navigate("/login")}
            className="back-link"
            disabled={isSubmitting}
          >
            ← Back to Login
          </button>
        </div>
      </section>
    </div>
  )
}

export default ForgotPasswordForm