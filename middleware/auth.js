const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            const error = new Error('Token not found, Please login first');
            error.statusCode = 403;
            throw error;
        }

        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!verify) {
            const error = new Error('Token did not verified, Invlid token');
            error.statusCode = 401;
            throw error;
        }

        const dbUser = await User.findByPk(verify.userId);
        if (!dbUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const updatedUser = dbUser;
        req.user = updatedUser;
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = auth;