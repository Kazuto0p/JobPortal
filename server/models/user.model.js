import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    profilepicture:{type:String, default: null},
    username:{type:String, required:true},
    email:{type:String, required:true},
    auth0:{ type:String, default:false },
    phone:{type:String, default: null},
    password:{type:String, deafult: null},
    otp:{type:Number, default:null},
    role: {type: String,enum: ['jobSeeker', 'recruiter'],default: null}
}, {
  timestamps: true

})

export default mongoose.model.Users || mongoose.model("User",userSchema)