import userModel from "../models/user.model.js";
import nodemailer from 'nodemailer'


export async function Signup(req,res) {
    try {
        const {email,password,username} = req.body;

        if(!(email && password)) {
            return res.status(400).json({message:"Please fill all the details "})
        }

        const data = await userModel.create({
            email,
            username,
            password
        })
        res.status(201).json({message:"User Created Successfully"})


    } catch (error) {
        console.log(err);
        res.status(400).json({message:"Error in creating user"})
    }
}