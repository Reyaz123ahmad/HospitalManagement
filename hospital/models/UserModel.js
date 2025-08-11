const mongoose=require('mongoose')

const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
        
        },
        
        password:{
            type:String,
            required:true
        },
        accountType:{
            type:String,
            enum:[
                "Admin", "Doctor","Customer"
            ],
            required:true,
            
        },
        assignedDoctor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor'
        },
        appointments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Appointment"
            }
        ]
        ,
        token: {
			type: String,
		},
	    resetPasswordExpires: {
		    type: Date,
	    },
	    image: {
            type: String,
            
	    },
        resetPasswordToken: {
            type: String 
        },
        
        
        

    },
    { timestamps: true }
    
);



module.exports=mongoose.model('User',userSchema)