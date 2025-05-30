import express from "express";
import { authsignup, getSavedJobs, getUser, getusers, logIn, removeSavedJob, savedJobs, Signup, updateRole } from "../controller/user_controller.js";

const router = express.Router();

router.post("/users", getUser); // New route for POST /api/users
router.get("/users", getusers); // GET /api/users
router.post("/signup", Signup);
router.post("/authsignup", authsignup);
router.post("/login", logIn);
router.put("/updateRole", updateRole);
router.post("/savedJobs", savedJobs);
router.post("/getSavedJobs", getSavedJobs);
router.post("/removeSavedJob", removeSavedJob);

export default router;