
const crypto = require("crypto");
const { instance } = require("../config/razorpay");
const Doctor = require("../models/DoctorModel");
const User = require("../models/UserModel");
const Appointment = require("../models/AppointmentModel");
const mailSender = require("../utils/mailSender");

// Create Razorpay Order
exports.capturePayment = async (req, res) => {
  try {
    const { doctor_id, appointmentDate, appointmentTime } = req.body;
    const userId = req.user.id;

    if (!doctor_id || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID, appointment date and time are required",
      });
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    // ✅ Check if patient has booked any appointment in last 24 hours
    const latestAppointment = await Appointment.findOne({
      patient: userId,
      status: { $in: ["booked", "completed"] },
    }).sort({ appointmentDateTime: -1 });

    if (latestAppointment) {
      const lastTime = new Date(latestAppointment.appointmentDateTime);
      const nextAllowedTime = new Date(lastTime.getTime() + 24 * 60 * 60 * 1000);

      if (appointmentDateTime < nextAllowedTime) {
        return res.status(400).json({
          success: false,
          message: "You can only book one appointment every 24 hours.",
        });
      }
    }

    // ✅ Check if slot is already taken
    const slotTaken = await Appointment.findOne({
      doctor: doctor_id,
      appointmentDateTime,
      status: "booked",
    });

    if (slotTaken) {
      return res.status(400).json({
        success: false,
        message: "Appointment slot is already booked.",
      });
    }

    const amount = doctor.consultationFee;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        doctor_id,
        userId,
        appointmentDate,
        appointmentTime,
      },
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      appointmentDate,
      appointmentTime,
    });
  } catch (error) {
    console.error("Payment initiation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
    });
  }
};

// Verify Razorpay Signature and Create Appointment
exports.verifySignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_SECRET;

    if (!secret) {
      throw new Error("RAZORPAY_SECRET is not defined");
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Signature mismatch",
      });
    }

    const { doctor_id, appointmentDate, appointmentTime } = req.body.notes;
    const userId = req.user.id;
    const amount = req.body.amount;

    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);

    // ✅ Check if patient has booked any appointment in last 24 hours
    const latestAppointment = await Appointment.findOne({
      patient: userId,
      status: { $in: ["booked", "completed"] },
    }).sort({ appointmentDateTime: -1 });

    if (latestAppointment) {
      const lastTime = new Date(latestAppointment.appointmentDateTime);
      const nextAllowedTime = new Date(lastTime.getTime() + 24 * 60 * 60 * 1000);

      if (appointmentDateTime < nextAllowedTime) {
        return res.status(400).json({
          success: false,
          message: "You can only book one appointment every 24 hours.",
        });
      }
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      doctor: doctor_id,
      patient: userId,
      appointmentDateTime,
      status: "booked",
      paymentId: razorpay_payment_id,
      amount,
    });

    // Update doctor and user records
    await Doctor.findByIdAndUpdate(
      doctor_id,
      { $addToSet: { patients: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appointments: appointment._id } },
      { new: true }
    );

    const user = await User.findById(userId);
    const doctor = await Doctor.findById(doctor_id);

    // Format date and time for email
    const formattedDate = appointmentDateTime.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = appointmentDateTime.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Send confirmation email
    try {
      const emailBody = `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${user.firstName},</p>
        <p>Your appointment with <strong>Dr. ${doctor.doctorName}</strong> (${doctor.specialization}) 
        has been confirmed for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>.</p>
        <p><strong>Consultation Fee:</strong> ₹${doctor.consultationFee}</p>
        <br/>
        <p>Thank you for choosing MediConnect!</p>
      `;

      await mailSender(user.email, "Appointment Confirmation", emailBody);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Signature verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error processing appointment",
    });
  }
};
