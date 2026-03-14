


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


router.post("/createDoctor", auth, isAdmin, createDoctor);


router.get("/getAllDoctors", getAllDoctors);


router.post("/getDoctorDetails", getDoctorDetails);




router.post("/createCategory", auth, isAdmin, createCategory);


router.get("/showAllCategories", showAllCategories);


router.post("/getCategoryPageDetails", categoryPageDetails);






router.post("/createContact", ContactForm);


module.exports = router;

