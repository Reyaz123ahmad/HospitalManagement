

// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (email, title, body) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     let info = await transporter.sendMail({
//       from: `"StudyNotion" <${process.env.MAIL_USER}>`,
//       to: email,
//       subject: title,
//       html: body,
//     });

//     console.log("Email sent:", info.response);
//     return info;
//   } catch (error) {
//     console.error("Email send error:", error);
//     throw error;
//   }
// };

// module.exports = mailSender;
const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    console.log("📧 Preparing to send email to:", email);
    console.log("📧 Using MAIL_HOST:", process.env.MAIL_HOST);
    console.log("📧 MAIL_USER exists:", !!process.env.MAIL_USER);
    console.log("📧 MAIL_PASS exists:", !!process.env.MAIL_PASS);

    // Validate environment variables
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Email configuration missing in environment variables");
    }

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Only for development
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ Transporter verified successfully");

    let info = await transporter.sendMail({
      from: `"Hospital Management" <${process.env.MAIL_USER}>`, // Changed from StudyNotion
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error; // Re-throw to handle in controller
  }
};

module.exports = mailSender;