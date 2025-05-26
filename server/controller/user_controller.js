import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js'; // Adjust path to your model
import jwt from 'jsonwebtoken'; // Add JWT for authentication

export async function Signup(req, res) {
    try {
        const { email, password, username } = req.body;

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

        res.status(201).json({ message: "User Created Successfully" });
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
            return res.status(400).json({ message: "Please provide email and password" });
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
            process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable in production
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing in", error: error.message });
    }
}