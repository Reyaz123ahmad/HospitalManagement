const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: true, // SSL एरर बायपास करें
        serverSelectionTimeoutMS: 5000, // 5 सेकंड टाइमआउट
        socketTimeoutMS: 3000, // कनेक्शन का टाइमआउट
    })
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    });
};