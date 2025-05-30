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
    auth0: { type: Boolean, default: false },
    phone: { type: String, default: null },
    password: { type: String, default: null },
    otp: { type: Number, default: null },
    role: { type: String, enum: ["jobSeeker", "recruiter"], default: null },
    savedjobs: [{ type: String }],
    // Additional profile fields
    location: { type: String, default: null },
    bio: { type: String, default: null },
    skills: { type: String, default: null },
    experience: { type: String, default: null },
    education: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    portfolio: { type: String, default: null },
    profileComplete: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);