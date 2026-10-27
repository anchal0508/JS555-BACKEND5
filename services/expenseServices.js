const { Op } = require('sequelize');
const { Expenses, sequelize, User } = require('../models/index');

const addNewExpense = async ({ infoOf, description, amount, date, category, currUserId }) => {
    const amountInt = Number(amount);

    // find recent row
    const lastExp = await Expenses.findOne({
        where: { userId: currUserId },
        order: [['createdAt', 'DESC']],
        raw: true
    });

    const lastTotalExp = lastExp ? Number(lastExp.totalExp) : 0;
    const lastTotalIncome = lastExp ? Number(lastExp.totalIncome) : 0;

    let updatedTotalExp;
    let updatedTotalIncome;

    if (infoOf === 'EXPENSE') {
        updatedTotalExp = lastTotalExp + amountInt;
        updatedTotalIncome = lastTotalIncome - amountInt;
    } else {
        updatedTotalIncome = (amountInt + lastTotalIncome);
        updatedTotalExp = lastTotalExp;
    }

    const response = await Expenses.create({
        infoOf,
        description,
        amount: amountInt,
        date,
        category,
        userId: currUserId,
        totalExp: updatedTotalExp,
        totalIncome: updatedTotalIncome
    });

    return response;
};

const fetchAllexpenses = async ({ currUserId, page, limit, search }) => {
    let limitNum = Number(limit) || 10;
    const pageNum = Number(page) || 1;
    let offsetValue = (pageNum * limitNum) - limitNum;

    // Fetching data according to the limit
    let whereClause = { userId: currUserId };
    
    if (search && search.trim() !== "") {
        limitNum = 100;
        offsetValue = 0;
        whereClause = {
            userId: currUserId,
            [Op.or]: [
                {
                    description: {
                        [Op.iLike]: `%${search.trim()}%` 
                    }
                },
                {
                    category: {
                        [Op.iLike]: `%${search.trim()}%` 
                    }
                }
            ]
        };
    }

    const { rows: expenses, count: totalItems } = await Expenses.findAndCountAll({
        where: whereClause,
        limit: limitNum,
        offset: offsetValue,
        order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    // Finding recent expense data
    const latestRecord = await Expenses.findOne({
        where: { userId: currUserId },
        order: [['createdAt', 'DESC']]
    });

    const totalExpense = latestRecord ? latestRecord.totalExp : 0;
    const totalIncome = latestRecord ? latestRecord.totalIncome : 0;

    // Fetching top-3 expense
    const topThreeLeader = await Expenses.findAll({ 
        attributes: [
            'userId',
            [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']  
        ],
        include: [ 
            {
                model: User, 
                as: 'User',  
                attributes: ['name'], 
            }
        ],
        where: {
            infoOf: 'EXPENSE'
        },
        group: ['Expenses.userId', 'User.id', 'User.name'], 
        order: [[sequelize.literal('"totalAmount"'), 'DESC']], 
        limit: 3,
        raw: true,
        nest: true 
    });

    return {
        expenses: expenses || [],
        totalPages: totalPages,
        totalItems: totalItems,
        totalExpense: totalExpense,
        totalIncome: totalIncome,
        topLeaders: topThreeLeader || []
    };
};

module.exports = {
    addNewExpense,
    fetchAllexpenses,
};
