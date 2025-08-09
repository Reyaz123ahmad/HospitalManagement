import React from 'react'
import Template from '../components/core/Auth/Template'


const Login = () => {
  return (
    <div>
      <Template
      title="Medical Hospital Portal"
      description1="Access your medical records, appointments, and health information."
      description2="Your health journey starts here."
      //image={signupImg}
      formType="login"
      />
    </div>
  )
}

export default Login
