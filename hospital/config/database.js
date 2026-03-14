



const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 3000,
    });

    console.log("DB Connected Successfully");

    
    await mongoose.connection.db.collection("users").createIndex(
      { accountType: 1 },
      {
        unique: true,
        partialFilterExpression: { accountType: "Admin" },
      }
    );

    console.log("Admin index ensured");

  } catch (error) {
    console.log("DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};
