const express = require('express');
const router = express.Router();
const {
    createTransaction,
    getTransactionsByUserId,
    getAllTransactions,
    updateTransaction
} = require('../controllers/transactionController');

// Route to create a new transaction
router.post('/', createTransaction);

// Route to get transactions by user ID
router.get('/user/:user_id', getTransactionsByUserId);

// Route to get all transactions (Admin only)
router.get('/', getAllTransactions);

// Route to update a transaction
router.put('/:transaction_id', updateTransaction);

module.exports = router;
