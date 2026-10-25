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