const { Expenses } = require('../models/index');
const { addNewExpense, fetchAllexpenses } = require('../services/expenseServices');

const addexpense = async (req, res, next) => {
    try {
        const { infoOf, description, amount, date, category } = req.body;
        const currUserId = req.user.id;
        await addNewExpense({ infoOf, description, amount, date, category, currUserId });
        return res.status(201).json({
            success: true,
            message: `new ${infoOf} has been added successfully...!`
        })
    } catch (error) {
        console.log('------', error.message);
        next(error);
    }
}

const deleteExpense = async (req, res, next) => {

}

const updateExpense = async (req, res, next) => {

}

const getAllExpenses = async (req, res, next) => {
    try {
        const currUserId = req.user.id;
        const { page, limit, search } = req.query;
        console.log(page, limit, currUserId, search, "000000000000");
        const response = await fetchAllexpenses({ currUserId, page, limit, search });
        return res.status(200).json({
            success: true,
            message: "All Expenses has beed received",
            expensesData: response
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    addexpense,
    deleteExpense,
    updateExpense,
    getAllExpenses,
}