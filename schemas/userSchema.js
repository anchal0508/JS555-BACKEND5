
const { z } = require('zod');

const signupSchema = z.object({
    name: z.string().min(1, "User name is required"),

    email: z.email("Email is required"),

    phone: z.string().min(10, "Please enter a valid 10 digits phone number"),

    role: z.string().default('USER'),

    password: z.string().min(6, 'Password should be atleast 6 characters long')
});


const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, "Please enter your password")
});


module.exports = {
    signupSchema,
    loginSchema
}