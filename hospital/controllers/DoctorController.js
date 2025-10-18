// const Doctor = require("../models/DoctorModel");
// const Category = require("../models/Category");
// const User = require("../models/UserModel");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");

// // Function to create a new doctor
// exports.createDoctor = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     let {
//       doctorName,
//       specialization,
//       userAccount,
//       consultationFee,
//       experience,
      
//       //tags,
//       category,
//       status
//     } = req.body;
//     const image=req.files.imageFile;

//     // Check required fields
//     if (
//       !doctorName ||
//       !specialization ||
//       !consultationFee || 
//       !category
//     ){
//         return res.status(400).json({
//           success: false,
//           message: "All Fields are Mandatory",
//         });
      
// 	    }
//       //upload video to cloudinary
//       const uploadDetails=await uploadImageToCloudinary(image,process.env.FOLDER_NAME);

//     status = status || "Draft";

//     // Check if the user is a doctor
//     const doctorDetails = await User.findOne({
//       _id: userId,
//       accountType: "Admin"
//     });

//     if (!doctorDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor Details Not Found",
//       });
//     }

//     // Check if category exists
//     const categoryDetails = await Category.findById(category);
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Not Found",
//       });
//     }

//     // Create new doctor
//     const newDoctor = await Doctor.create({
//       doctorName,
//       specialization,
//       userAccount: userId,
//       consultationFee,
//       experience,
//       //tags: tags || [],
//       category: categoryDetails._id,
//       doctorImage: uploadDetails.secure_url || `https://api.dicebear.com/5.x/initials/svg?seed=${doctorName}`,
//       status
//     });

//     // Update user's assignedDoctor field
//     await User.findByIdAndUpdate(
//       userId,
//       { $set: { assignedDoctor: newDoctor._id } },
//       { new: true }
//     );

//     // Update category's doctors array
//     await Category.findByIdAndUpdate(
//       category,
//       { $addToSet: { doctors: newDoctor._id } },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       data: newDoctor,
//       message: "Doctor Profile Created Successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create doctor profile",
//       error: error.message,
//     });
//   }
// };



const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mailSender = require("../utils/mailSender");

const generatePassword = () => Math.random().toString(36).slice(-8);

// exports.createDoctor = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     let {
//       doctorName,
//       specialization,
//       consultationFee,
//       experience,
//       category,
//       status,
//       doctorEmail // ✅ new field for doctor user account
//     } = req.body;

//     const image = req.files?.imageFile;

//     // ✅ Validate required fields
//     if (
//       !doctorName ||
//       !specialization ||
//       !consultationFee ||
//       !category ||
//       !doctorEmail ||
//       !image
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fields are Mandatory",
//       });
//     }

//     // ✅ Upload image to Cloudinary
//     const uploadDetails = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
//     status = status || "Draft";

//     // ✅ Check if current user is Admin
//     const adminUser = await User.findOne({
//       _id: userId,
//       accountType: "Admin",
//     });

//     if (!adminUser) {
//       return res.status(403).json({
//         success: false,
//         message: "Only Admins can create doctor profiles",
//       });
//     }

//     // ✅ Check if category exists
//     const categoryDetails = await Category.findById(category);
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Not Found",
//       });
//     }

//     // ✅ Generate password and create doctor user account
//     const password = generatePassword();
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const doctorUser = await User.create({
//       firstName: doctorName.split(" ")[0],
//       lastName: doctorName.split(" ")[1] || "",
//       email: doctorEmail,
//       password: hashedPassword,
//       accountType: "Doctor",
//     });

//     // ✅ Create doctor profile
//     const newDoctor = await Doctor.create({
//       doctorName,
//       specialization,
//       userAccount: doctorUser._id,
//       consultationFee,
//       experience,
//       category: categoryDetails._id,
//       doctorImage: uploadDetails.secure_url || `https://api.dicebear.com/5.x/initials/svg?seed=${doctorName}`,
//       status,
//     });

//     // ✅ Update category's doctors array
//     await Category.findByIdAndUpdate(
//       category,
//       { $addToSet: { doctors: newDoctor._id } },
//       { new: true }
//     );

//     // ✅ Send credentials to doctor via email
//     await mailSender(
//       doctorEmail,
//       "Your Doctor Account Credentials",
//       `<p>Hello Dr. ${doctorName},</p>
//        <p>Your account has been created. Use the following credentials to login:</p>
//        <p><strong>Email:</strong> ${doctorEmail}</p>
//        <p><strong>Password:</strong> ${password}</p>
//        <p>Please change your password after first login for security.</p>`
//     );

//     res.status(200).json({
//       success: true,
//       data: newDoctor,
//       message: "Doctor Profile and Account Created Successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create doctor profile",
//       error: error.message,
//     });
//   }
// };



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





