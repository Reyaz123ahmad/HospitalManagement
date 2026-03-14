

const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplates");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, 
  },
});


async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email - Hospital Management System",
      emailTemplate(otp)
    );
    console.log("Email sent successfully to:", email);
    return mailResponse;
  } catch (error) {
    console.error("Email send error:", error);
    
  }
}

OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    console.log("📧 Sending OTP to:", this.email);
    await sendVerificationEmail(this.email, this.otp);
    
    next();
  } else {
    next();
  }
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;