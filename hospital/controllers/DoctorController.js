


const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mailSender = require("../utils/mailSender");

const generatePassword = () => Math.random().toString(36).slice(-8);
const { createDoctorWithUserAndNotify } = require("../services/doctorService");

exports.createDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      specialization,
      consultationFee,
      experience,
      category,
      doctorEmail,
    } = req.body;

    const imageFile = req.files?.imageFile;

    if (!doctorName || !specialization || !consultationFee || !category || !doctorEmail || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const doctor = await createDoctorWithUserAndNotify({
      doctorName,
      specialization,
      consultationFee,
      experience,
      category,
      doctorEmail,
      imageFile,
    });

    res.status(200).json({
      success: true,
      message: "Doctor profile and account created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Doctor creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create doctor",
      error: error.message,
    });
  }
};


// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.find({})
      .populate("userAccount")
      .populate("category")
      .exec();

    return res.status(200).json({
      success: true,
      data: allDoctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Can't Fetch Doctors Data",
      error: error.message,
    });
  }
};

// Get doctor details
exports.getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.body;
    
    const doctorDetails = await Doctor.findById(doctorId)
      .populate("userAccount")
      .populate("category")
      .populate("patients")
      .exec();

    if (!doctorDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find doctor with id ${doctorId}`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor details fetched successfully",
      data: doctorDetails,
    });
    }catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





