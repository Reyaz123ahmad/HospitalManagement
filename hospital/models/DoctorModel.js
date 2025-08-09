const mongoose = require("mongoose");

// Define the Courses schema
const doctorSchema = new mongoose.Schema({
	doctorName: { 
        type: String,
        required:true,
        trim:true
    },
	specialization: { 
        type: String,
        required:true 
    },
	userAccount: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	
	consultationFee: {
		type: Number,
        required:true
	},
	experience:{
		type:String,

	},
	doctorImage: {
		type: String,
	},
	tags: {
		type: [String],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	patients: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	status: {
		type: String,
		enum: ["Draft", "Published"],
        default:"Draft"
	},
});

// Export the Courses model
module.exports = mongoose.model("Doctor", doctorSchema);


