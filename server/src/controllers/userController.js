import crypto from 'crypto';
import { pool } from '../db.js';

// ✅ SECURITY: Backend is the source of truth for prices
const PLANS_CATALOG = [
  { id: 'plan_starter', name: 'Starter Yield Node', price: 10000, dailyYield: 1200 },
  { id: 'plan_pro', name: 'Pro Yield Node', price: 30000, dailyYield: 4500 },
  { id: 'plan_elite', name: 'Elite Yield Node', price: 90000, dailyYield: 15000 },
  { id: 'plan_quantum', name: 'Quantum Yield Node', price: 150000, dailyYield: 26000 },
  { id: 'plan_enterprise', name: 'Enterprise Yield Node', price: 250000, dailyYield: 45000 },
  { id: 'plan_vip', name: 'VIP Yield Node', price: 500000, dailyYield: 95000 },
];

// @desc    Get current user profile (Used for Syncing)
// @route   GET /api/users/me
// @desc    Get current user profile (Used for Syncing)
// @route   GET /api/users/me
export const getMe = async (req, res) => {
  try {
    // ✅ ADDED last_check_in to the query
    const [users] = await pool.query(
      'SELECT id, phone, invite_code, balance, total_yield, last_check_in FROM users WHERE id = ?', 
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const u = users[0];
    
    // Fetch Nodes
    const [nodes] = await pool.query('SELECT * FROM nodes WHERE user_id = ?', [req.user.id]);
    const formattedNodes = nodes.map(n => ({
      id: n.id,
      planId: n.plan_id,
      name: n.name,
      buyPrice: parseFloat(n.buy_price),
      dailyYield: parseFloat(n.daily_yield),
      purchaseDate: n.purchase_date,
      status: n.status
    }));

    // Fetch Transactions
    const [transactions] = await pool.query(
      'SELECT id, type, amount, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC', 
      [req.user.id]
    );
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      status: t.status,
      date: t.created_at 
    }));

    res.json({
      id: u.id,
      phone: u.phone,
      inviteCode: u.invite_code,
      balance: parseFloat(u.balance),
      totalYield: parseFloat(u.total_yield),
      lastCheckIn: u.last_check_in, // ✅ ADDED to response
      nodes: formattedNodes,
      transactions: formattedTransactions 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Request a deposit
// @route   POST /api/users/deposit
export const deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount < 10000) return res.status(400).json({ message: 'Minimum deposit is 10,000 RWF' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // ✅ CHANGED: Do not update balance. Just log as Pending.
    await connection.query(
      'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.user.id, 'Deposit', amount, 'Pending']
    );

    await connection.commit();
    res.json({ message: 'Deposit request submitted. Awaiting admin approval.', amount });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Request a withdrawal
// @route   POST /api/users/withdraw
export const withdraw = async (req, res) => {
  const { amount, phoneNumber, network } = req.body;
  if (amount < 3000) return res.status(400).json({ message: 'Minimum withdrawal is 3,000 RWF' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [users] = await connection.query('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    if (users[0].balance < amount) throw new Error('Insufficient balance');

    // ✅ CHANGED: Deduct balance immediately to freeze funds, but mark transaction as Pending
    await connection.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, req.user.id]);
    
    await connection.query(
      'INSERT INTO transactions (id, user_id, type, amount, status, phone_number, network) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.user.id, 'Withdraw', -amount, 'Pending', phoneNumber, network]
    );

    await connection.commit();
    res.json({ message: 'Withdrawal request submitted. Awaiting admin approval.' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Purchase a yield node
// @route   POST /api/users/purchase
export const purchasePlan = async (req, res) => {
  const { planId } = req.body; // ✅ Only receive the ID, not the whole object
  
  // 1. Look up the plan on the server (prevents price tampering)
  const plan = PLANS_CATALOG.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [users] = await connection.query('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    if (users[0].balance < plan.price) throw new Error('Insufficient balance');

    // Deduct balance
    await connection.query('UPDATE users SET balance = balance - ? WHERE id = ?', [plan.price, req.user.id]);
    
    // Create node using trusted server-side plan data
    await connection.query(
      'INSERT INTO nodes (id, user_id, plan_id, name, buy_price, daily_yield) VALUES (?, ?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.user.id, plan.id, plan.name, plan.price, plan.dailyYield]
    );

    // Log transaction
    await connection.query(
      'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.user.id, 'Purchase', -plan.price, 'Success']
    );

    await connection.commit();
    res.json({ message: 'Node purchased successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

// @desc    Daily Check-in
// @route   POST /api/users/checkin
export const checkIn = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [users] = await connection.query('SELECT last_check_in FROM users WHERE id = ?', [req.user.id]);
    const lastCheckIn = users[0].last_check_in;
    const today = new Date().toDateString();

    if (lastCheckIn && new Date(lastCheckIn).toDateString() === today) {
      throw new Error('Already checked in today');
    }

    // Add 200 RWF bonus
    await connection.query('UPDATE users SET balance = balance + 200, last_check_in = NOW() WHERE id = ?', [req.user.id]);
    await connection.query(
      'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), req.user.id, 'Check-in', 200, 'Success']
    );

    await connection.commit();
    res.json({ message: 'Check-in successful', reward: 200 });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};