// import React, { useState } from "react"
// import axios from "axios"

// const ForgotPasswordForm = () => {
//   const [email, setEmail] = useState("")
//   const [message, setMessage] = useState({ type: "", text: "" })
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setMessage({ type: "", text: "" })

//     if (!email) {
//       return setMessage({ type: "error", text: "Email is required." })
//     }

//     try {
//       setLoading(true)
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/auth/forgot-password",
//         { email }
//       )

//       setMessage({ type: "success", text: response.data.message })
//     } catch (error) {
//       const errorMsg =
//         error.response?.data?.message || "Something went wrong."
//       setMessage({ type: "error", text: errorMsg })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="forgot-password-container">
//       <h2>🔑 Forgot Password</h2>
//       <form onSubmit={handleSubmit} className="forgot-password-form">
//         <label htmlFor="email">Enter your registered email:</label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           disabled={loading}
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>

//       {message.text && (
//         <p
//           className={`message ${
//             message.type === "error" ? "error" : "success"
//           }`}
//         >
//           {message.text}
//         </p>
//       )}
//     </div>
//   )
// }

// export default ForgotPasswordForm
import React, { useState } from "react"
import axios from "axios"
import './ForgotPassword.css'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [feedback, setFeedback] = useState({ type: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: "", message: "" })

    if (!email.trim()) {
      setFeedback({ type: "error", message: "Please enter your email address." })
      return
    }

    try {
      setIsSubmitting(true)
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/auth/forgot-password",
        { email }
      )
      setFeedback({ type: "success", message: data.message })
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred. Please try again."
      setFeedback({ type: "error", message: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="centered-container">
      <section className="form-card">
        <h2 className="form-title">🔐 Forgot Your Password?</h2>
        <p className="form-description">
          Enter your registered email address and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-button"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {feedback.message && (
          <div
            className={`form-feedback form-feedback--${feedback.type}`}
            role={feedback.type === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </div>
        )}
      </section>
    </div>
  )
}

export default ForgotPasswordForm
