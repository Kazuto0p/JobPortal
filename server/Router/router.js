import express from 'express'
import { Signup } from '../controller/user_controller.js'

const job = express.Router()

job.post("/Signup",Signup)

export default job