import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { phone, password, inviteCode } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check if user exists
    const [existingUsers] = await connection.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (existingUsers.length > 0) {
      throw new Error('Phone number already registered');
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate IDs and Codes
    const userId = crypto.randomUUID();
    const newInviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    
    let inviterId = null;

    // 4. STRICT INVITATION LOGIC
    const [userCountResult] = await connection.query('SELECT COUNT(*) as count FROM users');
    const isFirstUser = userCountResult[0].count === 0;

    if (!isFirstUser) {
      if (!inviteCode || inviteCode.trim() === '') {
        throw new Error('An invitation code is required to register');
      }

      const [inviters] = await connection.query('SELECT id FROM users WHERE invite_code = ?', [inviteCode.toUpperCase()]);
      if (inviters.length === 0) {
        throw new Error('Invalid invitation code');
      }
      
      inviterId = inviters[0].id;

      // Give inviter their 2,500 RWF bonus
      await connection.query('UPDATE users SET balance = balance + 2500 WHERE id = ?', [inviterId]);
      
      // Log the inviter's transaction
      await connection.query(
        'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
        [crypto.randomUUID(), inviterId, 'Referral', 2500, 'Success']
      );
    }

    // 5. Create the new user
    await connection.query(
      'INSERT INTO users (id, phone, password, invite_code, invited_by) VALUES (?, ?, ?, ?, ?)',
      [userId, phone, hashedPassword, newInviteCode, inviterId]
    );

    // 6. Log the new user's welcome bonus (1,000 RWF)
    await connection.query(
      'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), userId, 'Bonus', 1000, 'Success']
    );

    await connection.commit();

    // Fetch the new user to return
    const [newUser] = await connection.query('SELECT id, phone, invite_code, balance, total_yield FROM users WHERE id = ?', [userId]);

    // ✅ MAP TO CAMEL CASE FOR FRONTEND
    res.status(201).json({
      id: newUser[0].id,
      phone: newUser[0].phone,
      inviteCode: newUser[0].invite_code, // Map invite_code -> inviteCode
      balance: parseFloat(newUser[0].balance),
      totalYield: parseFloat(newUser[0].total_yield), // Map total_yield -> totalYield
      token: generateToken(userId)
    });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ MAP TO CAMEL CASE FOR FRONTEND
    res.json({
      id: user.id,
      phone: user.phone,
      inviteCode: user.invite_code, // Map invite_code -> inviteCode
      balance: parseFloat(user.balance),
      totalYield: parseFloat(user.total_yield), // Map total_yield -> totalYield
      token: generateToken(user.id)
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};