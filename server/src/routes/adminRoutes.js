import express from 'express';
import { 
  adminLogin, 
  getAdminStats, 
  getAllUsers, 
  updateUserBalance, 
  getAllTransactions, 
  killSystem,
  getPendingPayments,
  processPayment,
  getPasswordRequests,
  resetUserPassword,
  resetWithdrawPassword // ✅ Add this here
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Admin Login
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/balance', updateUserBalance);
router.get('/transactions', getAllTransactions);
router.post('/kill-system', killSystem);

// Payment Routes
router.get('/payments/pending', getPendingPayments);
router.post('/payments/:txId/process', processPayment);

// Password Reset Routes
router.get('/password-requests', getPasswordRequests);
router.post('/password-requests/:requestId/reset', resetUserPassword);
router.post('/password-requests/:requestId/reset-withdraw', resetWithdrawPassword); // ✅ Now it will work

export default router;