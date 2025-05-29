import bcrypt from "bcrypt";
import userModel from "../models/user.model.js"; // Adjust path to your model
import jwt from "jsonwebtoken"; // Add JWT for authentication
import mongoose from "mongoose";
import Job from "../models/job.model.js";

export async function Signup(req, res) {
  try {
    const { email, password, username, role } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const data = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    
    const token = jwt.sign(
        { email: data.email },
        process.env.JWT_SECRET || "your_jwt_secret", // Use environment variable in production
        { expiresIn: "1h" }
    );
    
    // console.log(data);
    // console.log(token);
    res.status(201).json({ message: "User Created Successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in creating user" });
  }
}

export async function logIn(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check if user exists
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    const isPassMatch = await bcrypt.compare(password, userExist.password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Generate JWT token (optional, for secure authentication)
    const token = jwt.sign(
      { userId: userExist._id, email: userExist.email },
      process.env.JWT_SECRET || "your_jwt_secret", // Use environment variable in production
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
}

export async function authsignup(req, res) {
  try {
    console.log("authsignup");
    // console.log(req.body);

    const { username, email } = req.body;
  
    const userExist = await userModel.findOne({ email });
    // console.log(userExist);
    // console.log("hiii");

    if (userExist) {
      if (userExist.auth0) return res.status(200).send({ data: userExist });
    }

    // console.log("hiii");

    const data = await userModel.create({ username, email, auth0: true });
    // console.log(data);
    res.status(201).send(data);
  } catch (error) {
    res.status(500).send({ message: "failed in store db", error });
  }
}

export async function getUser(req, res) {
  try {
    // console.log("inside of getUser function");
    // console.log(req.body);
    const email = req.body;
    const data = await userModel.findOne(email);
    // console.log(data);
    if (!data) {
      return res.status(404).json({ message: "Not Found" });
    }
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

export async function updateRole(req, res) {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    if (!["jobSeeker", "recruiter"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'jobSeeker' or 'recruiter'" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      { role: role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // console.log(`Role updated for user: ${email} to ${role}`);
    res.status(200).json({
      message: "Role updated successfully",
      user: {
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role" });
  }
}


export async function getusers(req, res) {
  try {
    // console.log("inside of get users function");
    const data = await userModel.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: "failed to fetch data", error });
  }
}


export async function savedJobs(req, res) {
  console.log("inside saved jobs");
  try {
    const { email, jobId } = req.body; // expect jobId instead of whole data
    console.log(req.body);

    if (!email || !jobId) {
      return res.status(400).json({ message: "Email or jobId is missing" });
    }

    // Validate jobId as a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Add only the jobId (string) to the savedjobs array
    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      { $addToSet: { savedjobs: jobId } }, // save just jobId string
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Job saved successfully", savedjobs: updatedUser.savedjobs });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Error saving job", error: error.message });
  }
}



export async function getSavedJobs(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email missing" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // savedjobs contains job IDs as strings
    const jobIds = user.savedjobs.map(id => new mongoose.Types.ObjectId(id));


    // fetch full jobs from Job collection
    const jobs = await Job.find({ _id: { $in: jobIds } });

    res.status(200).json({ savedJobs: jobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Error fetching saved jobs", error: error.message });
  }
}


export async function removeSavedJob(req, res) {
  try {
    const { email, jobId } = req.body;

    if (!email || !jobId) {
      return res.status(400).json({ message: "Email or jobId is missing" });
    }

    // Validate jobId as ObjectId string (optional, if you want strict validation)
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $pull: { savedjobs: jobId } },  // remove jobId from array
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Job removed successfully", savedjobs: updatedUser.savedjobs });
  } catch (error) {
    console.error("Error removing saved job:", error);
    res.status(500).json({ message: "Error removing saved job", error: error.message });
  }
}
