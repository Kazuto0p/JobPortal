import express from 'express';
import { 
  deleteUser,
  updateUserRole,
  deleteJob,
  getAllApplications
} from '../controller/admin_controller.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes with isAdmin middleware
router.use(isAdmin);

// User management
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', updateUserRole);

// Job management
router.delete('/jobs/:jobId', deleteJob);

// Application management
router.get('/applications', getAllApplications);

export default router; 