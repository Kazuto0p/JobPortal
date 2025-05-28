import Job from '../models/job.model.js';
// import jobModel from "../models/job.model";

// Create a new job posting
export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      location,
      salary,
      experiencelvl,
      role,
      jobdescription,
      requirements,
      postedBy,
      postedByEmail,
    } = req.body;

    // Validate required fields
    if (!company || !location || !salary || !experiencelvl || !role || !requirements) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const job = new Job({
      jobTitle: jobTitle || null,
      company,
      location,
      salary,
      experiencelvl,
      role,
      jobdescription: jobdescription || null,
      requirements,
      postedBy: postedBy || null,
      postedByEmail: postedByEmail || null,
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error while posting job' });
  }
};

// Fetch all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().select(
      'jobTitle company location salary experiencelvl role jobdescription requirements'
    );
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};