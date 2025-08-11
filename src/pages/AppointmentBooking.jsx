import React, { useState, useEffect } from "react";
//import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";
import "./AppointmentBooking.css";

const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// 🕒 Round current time to nearest 30-minute slot
const getRoundedTime = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 30) * 30;
  if (roundedMinutes === 60) {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  } else {
    now.setMinutes(roundedMinutes);
  }
  now.setSeconds(0);
  return now.toTimeString().slice(0, 5); // "HH:mm"
};

const AppointmentBooking = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctor_id");
  const date = searchParams.get("date");
  //const time = searchParams.get("time");

  // const [formData, setFormData] = useState({
  //   doctor_id: doctorId || "",
  //   appointmentDate: date || new Date().toISOString().slice(0, 10), // default to today
  //   appointmentTime: time || getRoundedTime(), // default to current rounded time
  // });
  const [formData, setFormData] = useState({
    doctor_id: doctorId || "",
    appointmentDate: date || new Date().toISOString().slice(0, 10),
    appointmentTime: getRoundedTime(), // ⏰ Always use real-time
  });


  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [autoTrigger, setAutoTrigger] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    if (doctorId) {
      axiosInstance
        .post("/doctor/getDoctorDetails", {
          doctorId: doctorId,
        })
        .then((res) => {
          setDoctorDetails(res.data.data);
          setAutoTrigger(true);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching doctor", err);
          setMessage("Failed to load doctor details.");
          setLoading(false);
        });
    }
  }, [doctorId]);

  useEffect(() => {
    if (
      autoTrigger &&
      doctorDetails &&
      formData.appointmentDate &&
      formData.appointmentTime
    ) {
      handlePayment();
    }
  }, [autoTrigger, doctorDetails, formData]);

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Failed to load Razorpay SDK");
        setPaymentProcessing(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("User not authenticated.");
        setPaymentProcessing(false);
        return;
      }

      const decoded = jwtDecode(token);

      const payload = {
        doctor_id: formData.doctor_id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      };

      const response = await axiosInstance.post(
        "/payment/capturePayment",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, amount, currency, doctorName } = response.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "HealthCare App",
        description: `Consultation with Dr. ${doctorName}`,
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            const verifyPayload = {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              notes: {
                doctor_id: formData.doctor_id,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
              },
              amount: doctorDetails.consultationFee,
            };

            await axiosInstance.post(
              "/payment/verifySignature",
              verifyPayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setMessage("Payment successful! Redirecting...");
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 2000);
          } catch (error) {
            console.error("Error after payment:", error.response?.data || error.message);
            setMessage("Payment succeeded but appointment creation failed.");
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: decoded.name || "Your Name",
          email: decoded.email || "your.email@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setPaymentProcessing(false);
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error initiating payment");
      setPaymentProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Select date";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Select time";
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    } catch {
      return "Invalid time";
    }
  };

  return (
     <div className="ab-container">
      <div className="ab-booking-header">
        <h2>Book Your Appointment</h2>
        <p>Confirm your appointment details and proceed to payment</p>
      </div>
      
      {loading ? (
        <div className="ab-processing-indicator">
          <div className="ab-spinner"></div>
          <p className="ab-loading-text">Loading doctor details...</p>
        </div>
      ) : doctorDetails ? (
        <div className="ab-booking-content">
          <div className="ab-doctor-card">
            <div className="ab-doctor-image-container">
              <img
                src={doctorDetails.doctorImage || "https://via.placeholder.com/150"}
                alt="Doctor"
                className="ab-doctor-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div className="ab-doctor-badge">
                <span>MD</span>
              </div>
            </div>
            
            <div className="ab-doctor-info">
              <h3 className="ab-doctor-name">Dr. {doctorDetails.doctorName}</h3>
              <p className="ab-doctor-specialization">{doctorDetails.specialization}</p>
              
              <div className="ab-doctor-stats">
                <div className="ab-stat-item">
                  <span className="ab-stat-value">15+</span>
                  <span className="ab-stat-label">Years Exp.</span>
                </div>
                <div className="ab-stat-item">
                  <span className="ab-stat-value">4.8</span>
                  <span className="ab-stat-label">Rating</span>
                </div>
                <div className="ab-stat-item">
                  <span className="ab-stat-value">2.5k</span>
                  <span className="ab-stat-label">Patients</span>
                </div>
              </div>
              
              <div className="ab-doctor-details">
                <div className="ab-detail-item">
                  <span className="ab-detail-label">Qualification:</span>
                  <span className="ab-detail-value">MBBS, MD ({doctorDetails.specialization})</span>
                </div>
                <div className="ab-detail-item">
                  <span className="ab-detail-label">Hospital:</span>
                  <span className="ab-detail-value">City General Hospital</span>
                </div>
                <div className="ab-detail-item">
                  <span className="ab-detail-label">Languages:</span>
                  <span className="ab-detail-value">English, Hindi, Spanish</span>
                </div>
              </div>
            </div>
            
            <div className="ab-appointment-details">
              <h4>Appointment Details</h4>
              <div className="ab-appointment-info">
                {/* Fixed date display */}
                <div className="ab-appointment-item">
                  <span className="ab-appointment-label">Date:</span>
                  <span className="ab-appointment-value">
                    {formatDate(formData.appointmentDate)}
                  </span>
                </div>
                
                {/* Fixed time display */}
                <div className="ab-appointment-item">
                  <span className="ab-appointment-label">Time:</span>
                  <span className="ab-appointment-value">
                    {formatTime(formData.appointmentTime)}
                  </span>
                </div>
                
                <div className="ab-appointment-item">
                  <span className="ab-appointment-label">Duration:</span>
                  <span className="ab-appointment-value">30 minutes</span>
                </div>
                <div className="ab-appointment-item">
                  <span className="ab-appointment-label">Consultation Fee:</span>
                  <span className="ab-appointment-value ab-fee-value">
                    ₹{doctorDetails.consultationFee}
                  </span>
                </div>
              </div>
              
              <div className="ab-payment-summary">
                <div className="ab-summary-item">
                  <span>Consultation Fee:</span>
                  <span>₹{doctorDetails.consultationFee}</span>
                </div>
                <div className="ab-summary-item">
                  <span>Platform Fee:</span>
                  <span>₹20</span>
                </div>
                <div className="ab-summary-item ab-total">
                  <span>Total Amount:</span>
                  <span>₹{Number(doctorDetails.consultationFee) + 20}</span>
                </div>
              </div>
              
              <button 
                className="ab-payment-button"
                onClick={handlePayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <>
                    <span className="ab-payment-spinner"></span>
                    Processing Payment...
                  </>
                ) : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="ab-message ab-message-error">{message}</p>
      )}
      
      {message && !loading && (
        <div className={`ab-message ${message.includes("Error") ? "ab-message-error" : "ab-message-success"}`}>
          {message}
        </div>
      )}
      
      <div className="ab-booking-footer">
        <p>Your payment is secure and encrypted. By booking this appointment, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default AppointmentBooking;




