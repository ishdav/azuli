import express from 'express';
import { 
  registerUser, 
  loginUser, 
  requestPasswordReset // ✅ Import this
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', requestPasswordReset); // ✅ Add this route

export default router;