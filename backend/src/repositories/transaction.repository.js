const pool = require('../config/db');

class TransactionRepository {
  async createTransaction(transactionData) {
    const { id, gateway, status, latency } = transactionData;
    
    await pool.query(
      `INSERT INTO transactions (id, gateway, status, latency) VALUES ($1, $2, $3, $4)`,
      [id, gateway, status, latency]
    );
  }
  async deleteAllTransactions() {
    await pool.query('TRUNCATE TABLE transactions');
  }
}

module.exports = new TransactionRepository();
