import express from 'express'
import { authsignup,  getUser, getusers, logIn, Signup, updateRole } from '../controller/user_controller.js'

const job = express.Router()

job.post("/Signup",Signup)
job.post("/authsignup",authsignup)

job.post("/logIn",logIn)

job.post("/getUser",getUser)
job.get("/getusers",getusers)
job.put("/updateRole",updateRole)

// job.post("/checkOrCreateUser",checkOrCreateUser)
export default job