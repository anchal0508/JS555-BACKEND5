
const { z } = require('zod');

const addExpenseSchema = z.object({
    infoOf: z.string().min(1, 'Please select either EXPENSE- or SALARY'),


    description: z
        .string().min(1, 'Description is required'),

    date: z.coerce.date({ message: 'Please enter a valid date' }),


    category: z
        .string()
        .min(1, 'Please check category is required'),

    amount: z
        .string()
        .min(1, 'please enter the amount')

});



module.exports = {
    addExpenseSchema,

}