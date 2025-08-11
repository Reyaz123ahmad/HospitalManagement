const express =  require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes=require('./routes/User');

const doctorRoutes=require('./routes/Doctor')
const paymentRoutes=require('./routes/Payments')
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const database = require("./config/database");

dotenv.config();
const PORT = process.env.PORT || 4000;


//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            'http://localhost:3000', // Add this if keeping backend on 3000
            'http://localhost:5173', 
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5177',
            'https://localhost:5173',
            'https://localhost:5177',
            'https://hospital-management-forntend.vercel.app'
        ],
        credentials: true
    })
);

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})