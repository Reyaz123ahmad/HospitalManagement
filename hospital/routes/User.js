const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
  resetPasswordToken,
  forgotPassword,
  deleteUser
} = require("../controllers/Auth");

const {
  getUserAppointments,
  cancelAppointment,
  completeAppointment,
  getAllAppointmentsForAdmin,
  getDoctorAppointments
} = require("../controllers/Appointment");


const { auth, isAdmin, isDoctor } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
router.post("/change-password", auth, changePassword);
router.delete("/delete-user", auth, deleteUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPasswordToken);

// ********************************************************************************************************
//                                      Appointment routes
// ********************************************************************************************************

router.get("/appointments", auth, getUserAppointments);
router.put("/appointments/cancel/:id", auth, cancelAppointment);
router.put("/appointments/complete/:id", auth, completeAppointment);
router.get("/admin/appointments", auth, isAdmin, getAllAppointmentsForAdmin);
router.get("/doctor/appointments", auth, isDoctor, getDoctorAppointments);





module.exports = router;
