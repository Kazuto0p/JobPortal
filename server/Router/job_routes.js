import express from "express";
import { createJob, getAllJobs } from "../controller/job_post.js";

const router = express.Router();

router.post("/jobs", createJob); // POST /api/jobs
router.get("/jobs", getAllJobs); // GET /api/jobs

export default router;