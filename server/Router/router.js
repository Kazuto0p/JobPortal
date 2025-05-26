import express from 'express'
import { authsignup, logIn, Signup } from '../controller/user_controller.js'

const job = express.Router()

job.post("/Signup",Signup)
job.post("/authsignup",authsignup)

job.post("/logIn",logIn)

export default job