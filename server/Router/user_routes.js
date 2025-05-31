import express from "express";
import multer from "multer";
import path from "path";
import { authsignup, getSavedJobs, getUser, getusers, logIn, removeSavedJob, savedJobs, Signup, updateProfile, updateRole } from "../controller/user_controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

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

// Public routes
router.post("/signup", Signup);
router.post("/authsignup", authsignup);
router.post("/login", logIn);

// Protected routes
router.post("/users", authenticateUser, getUser);
router.get("/users", authenticateUser, getusers);
router.put("/updateRole", authenticateUser, updateRole);
router.post("/savedJobs", authenticateUser, savedJobs);
router.post("/getSavedJobs", authenticateUser, getSavedJobs);
router.post("/removeSavedJob", authenticateUser, removeSavedJob);
router.put("/users/profile/:id", authenticateUser, upload.single('profilepicture'), updateProfile);
router.put("/updateProfile/:id", authenticateUser, upload.single('profilepicture'), updateProfile); 

export default router;