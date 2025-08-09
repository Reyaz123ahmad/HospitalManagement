


const express = require("express");
const router = express.Router();

// Import the Controllers
const {
  createDoctor,
  getAllDoctors,
  getDoctorDetails,
  
} = require("../controllers/DoctorController");

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/CategoryController");

const {
  ContactForm
  
} = require("../controllers/ContactForm");

// Import Auth Middlewares
const { auth, isDoctor, isCustomer, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Doctor routes
// ********************************************************************************************************

// Doctors can Only be Created by Admin or Doctor themselves
router.post("/createDoctor", auth, isAdmin, createDoctor);

// Get all Doctors (accessible to all)
router.get("/getAllDoctors", getAllDoctors);

// Get Details for a Specific Doctor
router.post("/getDoctorDetails", getDoctorDetails);



// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);

// Get all Categories (accessible to all)
router.get("/showAllCategories", showAllCategories);

// Get Category page details with doctors
router.post("/getCategoryPageDetails", categoryPageDetails);






router.post("/createContact", ContactForm);


module.exports = router;

