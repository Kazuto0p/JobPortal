import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js'; // Adjust path to your model
import jwt from 'jsonwebtoken'; // Add JWT for authentication

export async function Signup(req, res) {
    try {
        const { email, password, username ,role } = req.body;

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

export async function authsignup (req, res) {
    try {
        console.log("authsignup");
        console.log(req.body);

        const { username, email} = req.body
        console.log("hiii");
        const userExist = await userModel.findOne({ email })
        console.log(userExist);
        console.log("hiii");

        if(userExist){
            if(userExist.auth0) 
                return res.status(200).send({data: userExist})
        }
     
        console.log("hiii");

        const data = await userModel.create({username, email, auth0: true})
        console.log(data);
        res.status(201).send(data)
    } catch (error) {
        res.status(500).send({message: "failed in store db", error})
    }
}

export async function getUser (req,res) {
    try {
        console.log(req.body);
        const email = req.body
        const data = await userModel.findOne(email)
        if(!data) {
            return res.status(404).json({message:"Not Found"})
        }
        // console.log(data);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error})
    }
}


export async function updateRole(req, res) {
    try {
        const { email, role } = req.body;


        if (!email || !role) {
            return res.status(400).json({ message: "Email and role are required" });
        }

        if (!['jobSeeker', 'recruiter'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'jobSeeker' or 'recruiter'" });
        }


        const updatedUser = await userModel.findOneAndUpdate(
            { email: email },
            { role: role },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Role updated for user: ${email} to ${role}`);
        res.status(200).json({ 
            message: "Role updated successfully",
            user: {
                email: updatedUser.email,
                username: updatedUser.username,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Error updating role" });
    }
}

// route: POST /api/checkOrCreateUser

// export async function checkOrCreateUser(req, res) {
//     console.log(req.body);
//     try { 
//         const { email, username } = req.body;
        
//         if (!email || !username) {
//             return res.status(400).json({ message: 'Email and username are required' });
//         }
        
//         // Normalize email
//         const normalizedEmail = email.toLowerCase();
        
//         // Check for existing user
//         const existingUser = await userModel.findOne({ email: normalizedEmail });
        
//         if (existingUser) {
//             return res.status(200).json({ newUser: false });
//         }
        
//         // Create a new user
//         await userModel.create({
//             email: normalizedEmail,
//             username,
//             password: '', // No password for social login
//             role: '',      // Will be selected later
//         });
        
//         console.log("req.body");
//     return res.status(201).json({ newUser: true });
//   }
//    catch (err) {
//     console.error('checkOrCreateUser error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// }


export async function getusers(req, res){
    try {
        console.log("inside of get users function");
        const data = await userModel.find()
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send({message: "failed to fetch data", error})
    }
}