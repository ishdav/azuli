import { pool } from '../src/db.js';
import crypto from 'crypto';

export const processDailyPayouts = async () => {
  console.log("⏰ Starting daily yield payout...");
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ✅ FIX: Fetch purchase_date so we can calculate the 150-day limit
    const [nodes] = await connection.query(
      'SELECT id, user_id, daily_yield, purchase_date FROM nodes WHERE status = ?',
      ['Active']
    );

    if (nodes.length === 0) {
      console.log("No active nodes to process.");
      await connection.commit();
      return;
    }

    let processedCount = 0;

    for (const node of nodes) {
      // Calculate how many days the node has been running
      const daysPassed = Math.floor(
        (Date.now() - new Date(node.purchase_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      // ✅ FIX: If 150 days have passed, mark as Completed and skip payout
      if (daysPassed >= 150) {
        await connection.query("UPDATE nodes SET status = 'Completed' WHERE id = ?", [node.id]);
        continue; 
      }

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
      
      processedCount++;
    }

    await connection.commit();
    console.log(`✅ Successfully processed ${processedCount} node payouts.`);
  } catch (error) {
    await connection.rollback();
    console.error("❌ Payout failed:", error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
};

processDailyPayouts();