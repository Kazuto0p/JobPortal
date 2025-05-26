import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    profilepicture:{type:String, default: null},
    username:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, default: null},
    password:{type:String, deafult: null},
    otp:{type:Number, default:null}
})

export default mongoose.model.Users || mongoose.model("User",userSchema)