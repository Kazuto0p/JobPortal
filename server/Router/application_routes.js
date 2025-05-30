import express from "express";
import { applyForJob, getApplicationsForJobSeeker, getApplicationsForRecruiter, updateApplicationStatus } from "../controller/application_controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// All application routes should be authenticated
router.post("/apply", authenticateUser, applyForJob);
router.get("/recruiter/:recruiterEmail", authenticateUser, getApplicationsForRecruiter);
router.put("/:id/status", authenticateUser, updateApplicationStatus);
router.get("/jobseeker/:jobSeekerEmail", authenticateUser, getApplicationsForJobSeeker);

export default router;