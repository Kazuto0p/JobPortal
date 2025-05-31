import Application from "../models/application.model.js";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import path from 'path';
import fs from 'fs';

export const applyForJob = async (req, res) => {
  try {
    const { jobId, jobSeekerEmail } = req.body;
    

    if (!jobId || !jobSeekerEmail) {
      return res.status(400).json({ message: "Job ID and jobseeker email are required" });
    }

    // Find the user and verify role
    const user = await User.findOne({ email: jobSeekerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "jobSeeker") {
      return res.status(403).json({ message: "Only job seekers can apply for jobs" });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({ 
      jobId, 
      jobSeekerEmail,
      status: { $ne: "Rejected" } 
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: existingApplication.status === "Pending" 
          ? "You have already applied for this job and your application is pending"
          : "You have already been accepted for this job"
      });
    }

    // Handle resume upload
    let resumeData = null;
    if (req.file) {
      resumeData = {
        filename: req.file.filename,
        path: req.file.path,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype
      };
    }

    // Create and save the application
    const application = new Application({
      jobId,
      jobSeekerEmail,
      recruiterEmail: job.postedByEmail,
      status: "Pending",
      resume: resumeData
    });

    await application.save();

    res.status(201).json({ 
      message: "Application submitted successfully", 
      application 
    });

  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error while applying for job" });
  }
};

export const getApplicationsForRecruiter = async (req, res) => {
  try {
    const { recruiterEmail } = req.params;
    
    console.log('Fetching applications for recruiter:', {
      requestedEmail: recruiterEmail,
      authenticatedUser: req.user
    });

    if (!recruiterEmail) {
      return res.status(400).json({ message: "Recruiter email is required" });
    }

    // Verify that the authenticated user is the same as the requested recruiter
    if (!req.user || !req.user.email) {
      console.error('No authenticated user found');
      return res.status(401).json({ 
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }

    // Verify that the authenticated user has the recruiter role
    if (req.user.role !== 'recruiter') {
      console.error('User is not a recruiter:', {
        userEmail: req.user.email,
        userRole: req.user.role
      });
      return res.status(403).json({ 
        message: "Access denied. Only recruiters can access this resource.",
        code: "ROLE_FORBIDDEN"
      });
    }

    // Verify that the authenticated user is accessing their own applications
    if (req.user.email !== recruiterEmail) {
      console.error('User trying to access another recruiter\'s applications:', {
        authenticatedEmail: req.user.email,
        requestedEmail: recruiterEmail
      });
      return res.status(403).json({ 
        message: "You can only view your own applications",
        code: "ACCESS_FORBIDDEN"
      });
    }

    // Fetch applications where recruiterEmail matches
    const applications = await Application.find({ recruiterEmail })
      .populate({
        path: "jobId",
        select: "jobTitle company location postedByEmail",
        match: { postedByEmail: recruiterEmail },
      })
      .lean();

    console.log('Found applications:', {
      count: applications.length,
      validCount: applications.filter(app => app.jobId).length
    });

    const validApplications = applications.filter((app) => app.jobId);

    if (validApplications.length === 0) {
      return res.status(200).json({ message: "No applications found", applications: [] });
    }

    res.status(200).json({ applications: validApplications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!req.user?.email) {
      console.error('No user email in request:', req.user);
      return res.status(401).json({ message: "Authentication required" });
    }

    if (application.recruiterEmail !== req.user.email) {
      console.error('Unauthorized access attempt:', {
        applicationRecruiter: application.recruiterEmail,
        requestUser: req.user.email
      });
      return res.status(403).json({ message: "You don't have permission to update this application" });
    }


    application.status = status;
    await application.save();

    res.status(200).json({ 
      message: "Status updated successfully", 
      application 
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error while updating status" });
  }
};

export const getApplicationsForJobSeeker = async (req, res) => {
  try {
    const { jobSeekerEmail } = req.params;
    if (!jobSeekerEmail) {
      return res.status(400).json({ message: "Job seeker email is required" });
    }

    const applications = await Application.find({ jobSeekerEmail })
      .populate({
        path: "jobId",
        select: "jobTitle company location postedByEmail",
      })
      .lean();


    const validApplications = applications.filter((app) => app.jobId);

    res.status(200).json({ applications: validApplications || [] });
  } catch (error) {
    console.error("Error fetching job seeker applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};

export const getResume = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if resume exists
    if (!application.resume || !application.resume.path) {
      return res.status(404).json({ message: "No resume found for this application" });
    }

    // Check if the requester is the recruiter
    if (application.recruiterEmail !== req.user.email) {
      return res.status(403).json({ message: "You don't have permission to view this resume" });
    }

    // Check if file exists
    if (!fs.existsSync(application.resume.path)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    // Send the file
    res.sendFile(path.resolve(application.resume.path));
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Server error while fetching resume" });
  }
};