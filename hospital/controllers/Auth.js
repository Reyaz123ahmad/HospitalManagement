
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const User = require("../models/UserModel");
const OTP = require("../models/OTP");
const Appointment = require("../models/AppointmentModel");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Doctor = require("../models/DoctorModel");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
      specialization,
      experience,
      consultationFee,
    } = req.body;

    // 🔒 Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and confirm password do not match" });
    }

    if (!["Admin", "Doctor", "Customer"].includes(accountType)) {
      return res.status(400).json({ success: false, message: "Invalid account type" });
    }

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please sign in." });
    }

    // 🔐 Verify OTP
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 🔑 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const approved = accountType === "Doctor" ? false : true;

    // 👤 Create User
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      approved,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // 🩺 Create Doctor Profile if applicable
    if (accountType === "Doctor") {
      await Doctor.create({
        userId: user._id,
        status: "pending",
        specialization,
        experience,
        consultationFee,
      });

      // 📩 Optional: Notify Admin via email
      await mailSender(
        "admin@example.com", // Replace with actual admin email
        "New Doctor Approval Request",
        `Doctor ${firstName} ${lastName} has signed up and is awaiting approval.`
      );
    }

    return res.status(200).json({ success: true, user, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "User registration failed" });
  }
};


// 🔐 Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not registered. Please sign up." });
    }

    if (user.accountType === "Doctor" && user.approved) {
      return res.status(403).json({ success: false, message: "Your account is pending approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    console.log("NODE_ENV:", process.env.NODE_ENV);

    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      secure:true,
      sameSite: "None",
    };
    // Detect if request is from browser
    const isBrowser = req.headers['user-agent']?.includes("Mozilla");
    if (isBrowser) {
      res.cookie("token", token, options);
    }
    res.status(200).json({
      success: true,
      token,
      user,
      message: "Login successful",
    });
    // res.cookie("token", token, options).status(200).json({
    //   success: true,
    //   token,
    //   user,
    //   message: "Login successful",
    // });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

// 📩 Send OTP Controller
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already registered" });
    }

    let otp;
    let result;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    } while (result);

    await OTP.create({ email, otp });

    res.status(200).json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// 🔄 Change Password Controller
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    try {
      await mailSender(
        user.email,
        passwordUpdated(
          user.email,
          `Hi ${user.firstName}, your password has been successfully updated.`
        )
      );
    } catch (emailError) {
      console.error("Email error:", emailError);
      return res.status(500).json({ success: false, message: "Password updated, but email failed" });
    }

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Failed to update password" });
  }
};

// 🔐 Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    await mailSender(
      user.email,
      "Password Reset Request",
      `Click the link to reset your password: ${resetURL}`
    );

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔐 Reset Password Controller
exports.resetPasswordToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Hash the token to match stored value
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    // Update password and clear reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while resetting password",
    });
  }
};

// 🗑️ Delete User Controller



exports.deleteUser = async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user);

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing from token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Deleting appointments for user:", userId);
    await Appointment.deleteMany({
      $or: [{ patient: userId }, { doctor: userId }],
    });

    console.log("Deleting user:", userId);
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User and associated appointments deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};


// 📅 Get User Appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({ patient: userId })
      .populate("doctor", "doctorName specialization consultationFee")
      .sort({ appointmentDate: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Appointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments",
    });
  }
};
