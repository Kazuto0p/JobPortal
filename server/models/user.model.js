// import mongoose from "mongoose"

// const userSchema = new mongoose.Schema({
//     profilepicture:{type:String, default: null},
//     username:{type:String, required:true},
//     email:{type:String, required:true},
//     auth0:{ type:String, default:false },
//     phone:{type:String, default: null},
//     password:{type:String, deafult: null},
//     otp:{type:Number, default:null},
//     role: {type: String,enum: ['jobSeeker', 'recruiter'],default: null},
//     savedjobs: [
//   {
//     _id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Job',
//     },
//     company: String,
//     title: String,
//     salary: String,
//     location: String,
//     type: String,
//     role: String,
//   },
// ],


// }, {
//   timestamps: true

// })

// export default mongoose.model.Users || mongoose.model("User",userSchema)


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilepicture: { type: String, default: null },
    username: { type: String, required: true },
    email: { type: String, required: true },
    auth0: { type: String, default: null }, // Fix: `default: false` might be better as Boolean
    phone: { type: String, default: null },
    password: { type: String, default: null }, // Fix: Typo in `deafult`
    otp: { type: Number, default: null },
    role: { type: String, enum: ["jobSeeker", "recruiter"], default: null },
    savedjobs: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema); // Corrected export