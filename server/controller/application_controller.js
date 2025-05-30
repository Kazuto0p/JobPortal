import Application from "../models/application.model.js";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId, jobSeekerEmail } = req.body;
    
    // Validate required fields
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
      status: { $ne: "Rejected" } // Allow reapplying if previously rejected
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: existingApplication.status === "Pending" 
          ? "You have already applied for this job and your application is pending"
          : "You have already been accepted for this job"
      });
    }

    // Create and save the application
    const application = new Application({
      jobId,
      jobSeekerEmail,
      recruiterEmail: job.postedByEmail,
      status: "Pending"
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
    if (!recruiterEmail) {
      return res.status(400).json({ message: "Recruiter email is required" });
    }

    // Fetch applications where recruiterEmail matches
    const applications = await Application.find({ recruiterEmail })
      .populate({
        path: "jobId",
        select: "jobTitle company location postedByEmail",
        match: { postedByEmail: recruiterEmail }, // Ensure job was posted by recruiter
      })
      .lean();

    // Filter out applications where jobId is null (due to match)
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

    // Validate status
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the application
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the user's email exists
    if (!req.user?.email) {
      console.error('No user email in request:', req.user);
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify recruiter owns the job
    if (application.recruiterEmail !== req.user.email) {
      console.error('Unauthorized access attempt:', {
        applicationRecruiter: application.recruiterEmail,
        requestUser: req.user.email
      });
      return res.status(403).json({ message: "You don't have permission to update this application" });
    }

    // Update the status
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

    // Fetch applications where jobSeekerEmail matches
    const applications = await Application.find({ jobSeekerEmail })
      .populate({
        path: "jobId",
        select: "jobTitle company location postedByEmail",
      })
      .lean();

    // Filter out applications where jobId is null
    const validApplications = applications.filter((app) => app.jobId);

    res.status(200).json({ applications: validApplications || [] });
  } catch (error) {
    console.error("Error fetching job seeker applications:", error);
    res.status(500).json({ message: "Server error while fetching applications" });
  }
};