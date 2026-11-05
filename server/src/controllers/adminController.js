import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const generateAdminToken = () => {
  // Hardcoded admin login for now (you can create an admins table later)
  return jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded credentials (username: admin, password: admin123)
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: generateAdminToken() });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [usersCount] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [balanceSum] = await pool.query('SELECT SUM(balance) as totalBalance FROM users');
    const [stakedSum] = await pool.query('SELECT SUM(buy_price) as totalStaked FROM nodes');

    res.json({
      totalUsers: usersCount[0].totalUsers,
      totalBalance: parseFloat(balanceSum[0].totalBalance) || 0,
      totalStaked: parseFloat(stakedSum[0].totalStaked) || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // ✅ FIX: Use a subquery to count nodes for each user
    const [users] = await pool.query(`
      SELECT 
        u.id, 
        u.phone, 
        u.invite_code, 
        u.balance, 
        u.total_yield, 
        u.created_at,
        (SELECT COUNT(*) FROM nodes WHERE user_id = u.id) AS node_count
      FROM users u
      ORDER BY u.created_at DESC
    `);

    // Map database snake_case to frontend camelCase
    const formattedUsers = users.map(u => ({
      id: u.id,
      phone: u.phone,
      inviteCode: u.invite_code,
      balance: parseFloat(u.balance),
      totalYield: parseFloat(u.total_yield),
      nodeCount: Number(u.node_count) // ✅ Return the real count
    }));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserBalance = async (req, res) => {
  const { userId } = req.params;
  const { newBalance } = req.body;

  try {
    await pool.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);
    res.json({ message: 'Balance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const [txs] = await pool.query(`
      SELECT t.id, t.type, t.amount, t.status, t.created_at, u.phone as userPhone, u.id as userId 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const killSystem = async (req, res) => {
  try {
    // Disable foreign key checks to truncate tables safely
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE transactions');
    await pool.query('TRUNCATE TABLE nodes');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    res.json({ message: 'System killed and database wiped.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all Pending Transactions
export const getPendingPayments = async (req, res) => {
  try {
    const [txs] = await pool.query(`
      SELECT t.id, t.type, t.amount, t.status, t.created_at, t.phone_number, t.network, u.phone as userPhone, u.id as userId 
      FROM transactions t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.status = 'Pending'
      ORDER BY t.created_at DESC
    `);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or Reject a Transaction
export const processPayment = async (req, res) => {
  const { txId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get the transaction
    const [txs] = await connection.query('SELECT * FROM transactions WHERE id = ?', [txId]);
    if (txs.length === 0) throw new Error('Transaction not found');
    const tx = txs[0];

    if (tx.status !== 'Pending') throw new Error('Transaction already processed');

    if (action === 'approve') {
      // If it's a Deposit, add balance. (Withdrawals were already deducted)
      if (tx.type === 'Deposit') {
        await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [tx.amount, tx.user_id]);
      }
      // ✅ FIX: Use single quotes for 'Success'
      await connection.query("UPDATE transactions SET status = 'Success' WHERE id = ?", [txId]);
      await connection.commit();
      res.json({ message: 'Transaction approved successfully' });
      
    } else if (action === 'reject') {
      // If it's a Withdrawal, refund the balance. (Deposits were never added)
      if (tx.type === 'Withdraw') {
        await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [Math.abs(tx.amount), tx.user_id]);
      }
      // ✅ FIX: Use single quotes for 'Rejected'
      await connection.query("UPDATE transactions SET status = 'Rejected' WHERE id = ?", [txId]);
      await connection.commit();
      res.json({ message: 'Transaction rejected and refunded' });
      
    } else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

import bcrypt from 'bcryptjs'; // Make sure this is imported at the top

// @desc    Get all pending password reset requests
export const getPasswordRequests = async (req, res) => {
  try {
    // ✅ FIX: Use single quotes for 'Pending'
    const [requests] = await pool.query(
      "SELECT id, phone, status, created_at FROM password_reset_requests WHERE status = 'Pending' ORDER BY created_at DESC"
    );
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset a user's password manually
export const resetUserPassword = async (req, res) => {
  const { requestId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get the request
    const [requests] = await connection.query('SELECT phone FROM password_reset_requests WHERE id = ?', [requestId]);
    if (requests.length === 0) throw new Error('Request not found');
    const phone = requests[0].phone;

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update user's password
    await connection.query('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, phone]);

    // 4. Mark request as resolved
    // ✅ FIX: Use single quotes for 'Resolved'
    await connection.query("UPDATE password_reset_requests SET status = 'Resolved' WHERE id = ?", [requestId]);

    await connection.commit();
    res.json({ message: 'Password reset successfully. Send it to the user on WhatsApp.' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};
// @desc    Reset a user's withdraw password (set to NULL)
export const resetWithdrawPassword = async (req, res) => {
  const { requestId } = req.params;
  const connection = await pool.getConnection();

  try {
    // 1. Get the request
    const [requests] = await connection.query('SELECT phone FROM password_reset_requests WHERE id = ?', [requestId]);
    if (requests.length === 0) throw new Error('Request not found');
    const phone = requests[0].phone;

    // 2. Clear the withdraw password (so they can create a new one next time)
    await connection.query('UPDATE users SET withdraw_password = NULL WHERE phone = ?', [phone]);

    // 3. Mark request as resolved
    await connection.query("UPDATE password_reset_requests SET status = 'Resolved' WHERE id = ?", [requestId]);

    res.json({ message: 'Withdraw password cleared. User can now create a new one.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};