const Appointment = require("../models/AppointmentModel");

// Get all appointments for logged-in customer
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({ patient: userId })
      .populate("doctor", "doctorName specialization doctorImage")
      .sort({ appointmentDateTime: 1 });

    const grouped = {
      booked: [],
      completed: [],
      cancelled: [],
      expired: [],
    };

    appointments.forEach((appt) => {
      grouped[appt.status]?.push(appt);
    });

    return res.status(200).json({
      success: true,
      appointments: grouped,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not fetch appointments",
    });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not cancel appointment",
    });
  }
};

// Mark appointment as completed
exports.completeAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "completed";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
    });
  } catch (error) {
    console.error("Complete error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not complete appointment",
    });
  }
};



// Get all appointments for logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "firstName lastName email")
      .populate("doctor", "doctorName specialization doctorImage")
      .sort({ appointmentDateTime: 1 });

    const grouped = {
      booked: [],
      completed: [],
      cancelled: [],
      expired: [],
    };

    const now = new Date();

    appointments.forEach((appt) => {
      if (appt.status === "cancelled") {
        grouped.cancelled.push(appt);
      } else if (appt.status === "completed") {
        grouped.completed.push(appt);
      } else if (new Date(appt.appointmentDateTime) < now && appt.status === "booked") {
        grouped.expired.push(appt);
      } else {
        grouped.booked.push(appt);
      }
    });

    return res.status(200).json({
      success: true,
      appointments: grouped,
    });
  } catch (error) {
    console.error("Doctor fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not fetch appointments for doctor",
    });
  }
};


// Get all appointments for admin
exports.getAllAppointmentsForAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "doctorName specialization doctorImage")
      .populate("patient", "firstName lastName email")
      .sort({ appointmentDateTime: 1 });

    const grouped = {
      booked: [],
      completed: [],
      cancelled: [],
      expired: [],
    };

    appointments.forEach((appt) => {
      grouped[appt.status]?.push(appt);
    });

    return res.status(200).json({
      success: true,
      appointments: grouped,
    });
  } catch (error) {
    console.error("Admin fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not fetch appointments for admin",
    });
  }
};


// const Appointment = require("../models/AppointmentModel");
// const Doctor = require("../models/DoctorModel");
// const User = require("../models/UserModel");
// const mailSender = require("../utils/mailSender");

// // Helper: Group appointments by status
// const groupAppointments = (appointments) => {
//   const grouped = {
//     booked: [],
//     completed: [],
//     cancelled: [],
//     expired: [],
//   };

//   const now = new Date();

//   appointments.forEach((appt) => {
//     if (appt.status === "cancelled") {
//       grouped.cancelled.push(appt);
//     } else if (appt.status === "completed") {
//       grouped.completed.push(appt);
//     } else if (appt.status === "booked" && new Date(appt.appointmentDateTime) < now) {
//       grouped.expired.push(appt);
//     } else {
//       grouped.booked.push(appt);
//     }
//   });

//   return grouped;
// };

// // 📌 Get appointments for logged-in customer
// exports.getUserAppointments = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const appointments = await Appointment.find({ patient: userId })
//       .populate("doctor", "doctorName specialization doctorImage")
//       .sort({ appointmentDateTime: 1 });

//     return res.status(200).json({
//       success: true,
//       appointments: groupAppointments(appointments),
//     });
//   } catch (error) {
//     console.error("Dashboard error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not fetch appointments",
//     });
//   }
// };

// // 📌 Get appointments for logged-in doctor
// exports.getDoctorAppointments = async (req, res) => {
//   try {
//     const doctorId = req.user.id;

//     const appointments = await Appointment.find({ doctor: doctorId })
//       .populate("patient", "firstName lastName email")
//       .populate("doctor", "doctorName specialization doctorImage")
//       .sort({ appointmentDateTime: 1 });

//     return res.status(200).json({
//       success: true,
//       appointments: groupAppointments(appointments),
//     });
//   } catch (error) {
//     console.error("Doctor fetch error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not fetch appointments for doctor",
//     });
//   }
// };

// // 📌 Get all appointments for admin
// exports.getAllAppointmentsForAdmin = async (req, res) => {
//   try {
//     const appointments = await Appointment.find()
//       .populate("doctor", "doctorName specialization doctorImage")
//       .populate("patient", "firstName lastName email")
//       .sort({ appointmentDateTime: 1 });

//     return res.status(200).json({
//       success: true,
//       appointments: groupAppointments(appointments),
//     });
//   } catch (error) {
//     console.error("Admin fetch error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not fetch appointments for admin",
//     });
//   }
// };

// // 📌 Cancel an appointment
// exports.cancelAppointment = async (req, res) => {
//   try {
//     const appointmentId = req.params.id;
//     const userId = req.user.id;

//     const appointment = await Appointment.findOne({
//       _id: appointmentId,
//       patient: userId,
//     }).populate("doctor");

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     if (appointment.status !== "booked") {
//       return res.status(400).json({
//         success: false,
//         message: "Only booked appointments can be cancelled",
//       });
//     }

//     appointment.status = "cancelled";
//     await appointment.save();

//     // Optional: Send cancellation email
//     const user = await User.findById(userId);
//     const formattedDate = appointment.appointmentDateTime.toLocaleDateString("en-IN", {
//       weekday: "long", year: "numeric", month: "long", day: "numeric"
//     });
//     const formattedTime = appointment.appointmentDateTime.toLocaleTimeString("en-IN", {
//       hour: "2-digit", minute: "2-digit", hour12: true
//     });

//     const emailBody = `
//       <h2>Appointment Cancelled</h2>
//       <p>Dear ${user.firstName},</p>
//       <p>Your appointment with Dr. ${appointment.doctor.doctorName} on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been cancelled.</p>
//     `;

//     await mailSender(user.email, "Appointment Cancelled", emailBody);

//     return res.status(200).json({
//       success: true,
//       message: "Appointment cancelled successfully",
//     });
//   } catch (error) {
//     console.error("Cancel error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not cancel appointment",
//     });
//   }
// };

// // 📌 Mark appointment as completed
// exports.completeAppointment = async (req, res) => {
//   try {
//     const appointmentId = req.params.id;
//     const userId = req.user.id;

//     const appointment = await Appointment.findOne({
//       _id: appointmentId,
//       patient: userId,
//     }).populate("doctor");

//     if (!appointment) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     if (appointment.status !== "booked") {
//       return res.status(400).json({
//         success: false,
//         message: "Only booked appointments can be marked as completed",
//       });
//     }

//     appointment.status = "completed";
//     await appointment.save();

//     // Optional: Send completion email
//     const user = await User.findById(userId);
//     const formattedDate = appointment.appointmentDateTime.toLocaleDateString("en-IN", {
//       weekday: "long", year: "numeric", month: "long", day: "numeric"
//     });
//     const formattedTime = appointment.appointmentDateTime.toLocaleTimeString("en-IN", {
//       hour: "2-digit", minute: "2-digit", hour12: true
//     });

//     const emailBody = `
//       <h2>Appointment Completed</h2>
//       <p>Dear ${user.firstName},</p>
//       <p>Your appointment with Dr. ${appointment.doctor.doctorName} on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been marked as completed.</p>
//     `;

//     await mailSender(user.email, "Appointment Completed", emailBody);

//     return res.status(200).json({
//       success: true,
//       message: "Appointment marked as completed",
//     });
//   } catch (error) {
//     console.error("Complete error:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Could not complete appointment",
//     });
//   }
// };


