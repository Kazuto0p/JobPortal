import express from "express";
import multer from "multer";
import path from "path";
import { authsignup, getSavedJobs, getUser, getusers, logIn, removeSavedJob, savedJobs, Signup, updateProfile, updateRole } from "../controller/user_controller.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/users", getUser); // New route for POST /api/users
router.get("/users", getusers); // GET /api/users
router.post("/signup", Signup);
router.post("/authsignup", authsignup);
router.post("/login", logIn);
router.put("/updateRole", updateRole);
router.post("/savedJobs", savedJobs);
router.post("/getSavedJobs", getSavedJobs);
router.post("/removeSavedJob", removeSavedJob);

// Profile update routes
router.put("/users/profile/:id", upload.single('profilepicture'), updateProfile);
router.put("/updateProfile/:id", upload.single('profilepicture'), updateProfile); // Alias route for backward compatibility

export default router;