import express from 'express';
import { 
  adminLogin, 
  getAdminStats, 
  getAllUsers, 
  updateUserBalance, 
  getAllTransactions, 
  killSystem 
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Admin Login
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin); // All routes below this require an admin token

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/balance', updateUserBalance);
router.get('/transactions', getAllTransactions);
router.post('/kill-system', killSystem);

export default router;