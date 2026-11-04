const auth = require('../middleware/auth');

const router = require('express').Router();
const { addexpense, deleteExpense, updateExpense, getAllExpenses, getReport } = require('../controller/expenseController');
const validation = require('../middleware/formValidation');
const { addExpenseSchema } = require('../schemas/expenseSchema');

router.post('/addexp', auth, validation(addExpenseSchema), addexpense);
router.delete('/delete/:id', auth, deleteExpense);
router.put('/update/:id', auth, updateExpense);
router.get('/get-all-exp', auth, getAllExpenses);
router.get('/get-cat-report', auth, getReport);




module.exports = router;