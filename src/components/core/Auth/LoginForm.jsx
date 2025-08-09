import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI.jsx"

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password,navigate)()
    
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          Email Address <span className="required">*</span>
        </label>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Password <span className="required">*</span>
        </label>
        <div className="password-input-wrapper">
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            className="form-input"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="forgot-password">
        <Link to="/forgot-password" className="forgot-link">
          Forgot Password?
        </Link>
      </div>
      

      <button type="submit" className="submit-button">
        Sign In
      </button>

      <div className="signup-redirect">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Create Account
          </Link>
        </p>
      </div>
    </form>
  )
}

export default LoginForm




