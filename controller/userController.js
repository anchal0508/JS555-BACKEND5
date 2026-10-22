const { addNewUser, tryLoginUser } = require('../services/userServices');
const jwt = require('jsonwebtoken');


const addUser = async (req, res, next) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const response = await addNewUser({ name, email, phone, password, role });

        return res.status(201).json({
            success: true,
            message: "User has been registered successfully...!",
            userInfo: response
        })
    } catch (error) {
        console.log('Error: --------', error);
        next(error);
    }
}

const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error("User not found, Please login again");
            error.statuCode = 404;
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "User is Logged-In",
            userInfo: req.user
        })
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const response = await tryLoginUser({ email, password });


        const token = jwt.sign(
            { userId: response.id, email: response.email, role: response.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE_IN }
        )

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1d
        })


        return res.status(200).json({
            success: true,
            message: "User logged-in Successfully...!",
            userInfo: response
        })

    } catch (error) {
        console.log(error.response?.data?.message, error);
        next(error);
    }
}

const logout = async (req, res, next) => {

    const isProduction = process.env.NODE_ENV === 'production';
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
        })
        return res.status(200).json({
            success: true,
            message: "logged out Sucessfull"
        })
    } catch (error) {
        next(error);
    }
}
module.exports = {
    addUser,
    getMe,
    login,
    logout,


}