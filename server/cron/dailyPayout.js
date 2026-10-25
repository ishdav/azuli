// server/cron/dailyPayout.js
import { pool } from '../src/db.js';
import crypto from 'crypto';

export const processDailyPayouts = async () => {
  console.log("⏰ Starting daily yield payout...");
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get all active nodes (FIXED: using ? placeholder)
    const [nodes] = await connection.query(
      'SELECT id, user_id, daily_yield FROM nodes WHERE status = ?',
      ['Active']
    );

    if (nodes.length === 0) {
      console.log("No active nodes to process.");
      await connection.commit();
      return;
    }

    // 2. Process each node
    for (const node of nodes) {
      const amount = parseFloat(node.daily_yield);

      // Add to user's balance
      await connection.query(
        'UPDATE users SET balance = balance + ?, total_yield = total_yield + ? WHERE id = ?',
        [amount, amount, node.user_id]
      );

      // Log the transaction
      await connection.query(
        'INSERT INTO transactions (id, user_id, type, amount, status) VALUES (?, ?, ?, ?, ?)',
        [crypto.randomUUID(), node.user_id, 'Daily Yield', amount, 'Success']
      );
    }

    await connection.commit();
    console.log(`✅ Successfully processed ${nodes.length} node payouts.`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Payout failed:", error.message);
  } finally {
    connection.release();
    process.exit(0); // Important: Exit the process so Render/GitHub knows the job is done
  }
};

// Execute the function
processDailyPayouts();