import express from 'express'
import { logIn, Signup } from '../controller/user_controller.js'

const job = express.Router()

job.post("/Signup",Signup)

job.post("/logIn",logIn)

export default job