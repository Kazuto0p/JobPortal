import express from 'express';
import { 
  deleteUser,
  updateUserRole,
  deleteJob,
  getAllApplications,
  getAllUsers,
  getAllJobs
} from '../controller/admin_controller.js';
import { authenticateUser, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes should be authenticated and admin-only
router.use(authenticateUser);
router.use(isAdmin);

// Admin routes
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', updateUserRole);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:jobId', deleteJob);
router.get('/applications', getAllApplications);

export default router; 