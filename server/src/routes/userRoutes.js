import express from 'express';
import { getMe, deposit, withdraw, purchasePlan } from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protectUser); // All routes require auth

router.get('/me', getMe);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/purchase', purchasePlan);

export default router;