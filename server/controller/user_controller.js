import bcrypt from "bcrypt";
import userModel from "../models/user.model.js"; // Adjust path to your model
import jwt from "jsonwebtoken"; // Add JWT for authentication
import mongoose from "mongoose";
import Job from "../models/job.model.js";

// Define JWT secret consistently
const JWT_SECRET = process.env.JWT_KEY || "your_jwt_secret";

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

    // Create new user without a role
    const data = await userModel.create({
      email,
      username,
      password: hashedPassword,
      role: null // Don't set a default role, let user choose
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: data._id, email: data.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: "User created successfully", 
      token, 
      data,
      needsRole: true // Add this flag to indicate role selection is needed
    });
  } catch (error) {
    console.error("Error in Signup:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
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

    // Generate JWT token with consistent secret
    const token = jwt.sign(
      { userId: userExist._id, email: userExist.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ 
      message: "Logged in successfully", 
      token,
      data: userExist // Include user data in response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
}

export async function authsignup(req, res) {
  try {
    console.log("authsignup");
    const { username, email, role } = req.body;
  
    const userExist = await userModel.findOne({ email });

    if (userExist) {
      // If user exists and has a role, return as is
      if (userExist.auth0 && userExist.role) {
        return res.status(200).send({ 
          data: userExist,
          needsRole: false
        });
      }
      // If user exists but has no role, indicate role selection needed
      if (userExist.auth0) {
        return res.status(200).send({ 
          data: userExist,
          needsRole: true
        });
      }
    }

    // Create new user without a role
    const data = await userModel.create({ 
      username, 
      email, 
      auth0: true,
      role: null // Don't set a default role, let user choose
    });
    
    res.status(201).send({
      data,
      needsRole: true // Indicate that role selection is needed
    });
  } catch (error) {
    console.error("Error in authsignup:", error);
    res.status(500).send({ message: "failed in store db", error: error.message });
  }
}

export async function getUser(req, res) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const data = await userModel.findOne({ email });
    
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export async function updateRole(req, res) {
  try {
    const { email, role } = req.body;
    console.log('Attempting to update role:', { email, role });

    if (!email || !role) {
      console.log('Missing required fields:', { email, role });
      return res.status(400).json({ message: "Email and role are required" });
    }

    if (!["jobSeeker", "recruiter"].includes(role)) {
      console.log('Invalid role provided:', role);
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'jobSeeker' or 'recruiter'" });
    }

    // Find user first to verify they exist
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Current user state:', existingUser);

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      { 
        $set: {
          role: role,
          profileComplete: false // Reset profile completion when role changes
        }
      },
      { new: true }
    );

    console.log('Role update result:', updatedUser);
    res.status(200).json({
      message: "Role updated successfully",
      data: updatedUser,
      needsProfile: true // Always require profile completion after role change
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error: error.message });
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

    // Validate jobId format (24 hex chars for ObjectId)
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    const jobIdStr = jobId.toString();

    // Log before update
    const userBefore = await userModel.findOne({ email }).lean();
    console.log("Before update savedjobs:", userBefore?.savedjobs);

    // Pull jobId from savedjobs array
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { $pull: { savedjobs: jobIdStr } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log after update
    console.log("After update savedjobs:", updatedUser.savedjobs);

    return res.status(200).json({
      message: "Job removed successfully",
      savedJobs: updatedUser.savedjobs,
    });
  } catch (error) {
    console.error("Error removing saved job:", error);
    return res.status(500).json({
      message: "Error removing saved job",
      error: error.message,
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updating profile for user:', id);
    console.log('Update data:', updates);

    // If there's a file uploaded, add its path
    if (req.file) {
      updates.profilepicture = req.file.path;
    }

    // Find user first to preserve existing data
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Preserve role if not explicitly updated
    if (!updates.role) {
      updates.role = existingUser.role;
    }

    // Set profileComplete to true when updating profile
    updates.profileComplete = true;

    const user = await userModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    console.log('Profile updated successfully:', user);
    res.json({ data: user });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
}