const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mailSender = require("../utils/mailSender");

const generatePassword = () => Math.random().toString(36).slice(-8);

exports.createDoctorWithUserAndNotify = async ({
  doctorName,
  specialization,
  consultationFee,
  experience,
  category,
  doctorEmail,
  imageFile
}) => {
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const doctorUser = await User.create({
    firstName: doctorName.split(" ")[0],
    lastName: doctorName.split(" ")[1] || "",
    email: doctorEmail,
    password: hashedPassword,
    accountType: "Doctor",
  });

  const uploadDetails = await uploadImageToCloudinary(imageFile, process.env.FOLDER_NAME);

  const categoryDetails = await Category.findById(category);
  if (!categoryDetails) throw new Error("Invalid category ID");

  const newDoctor = await Doctor.create({
    doctorName,
    specialization,
    userAccount: doctorUser._id,
    consultationFee,
    experience,
    category: categoryDetails._id,
    doctorImage: uploadDetails.secure_url,
    status: "Published",
  });

  await Category.findByIdAndUpdate(category, {
    $addToSet: { doctors: newDoctor._id },
  });

  await mailSender(
    doctorEmail,
    "Your Doctor Account Credentials",
    `<p>Hello Dr. ${doctorName},</p>
     <p>Your account has been created. Use the following credentials to login:</p>
     <p><strong>Email:</strong> ${doctorEmail}</p>
     <p><strong>Password:</strong> ${password}</p>
     <p>Please change your password after first login for security.</p>`
  );

  return newDoctor;
};
