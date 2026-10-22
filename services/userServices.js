const { User } = require('../models/index');
const bcrypt = require('bcryptjs');

const addNewUser = async ({ email, name, phone, password, role }) => {
    const existingUser = await User.findOne({
        where: { email: email }
    });

    if (existingUser) {
        const error = new Error('User has been registerd already');
        error.statusCode = 400;
        throw error;
    }
    
    const newUser = await User.create({
        name,
        email,
        phone,
        password,
        role:'USER',
    });

    return newUser;
}

const tryLoginUser = async ({ email, password }) => {
    try {
        const availableUser = await User.findOne({
            where: { email: email }
        });
        if (!availableUser) {
            const error = new Error('User not found------ email');
            error.statusCode = 404;
            throw error;
        }

        const authinticatedUser = await bcrypt.compare(password, availableUser.password) ;
        if (!authinticatedUser) {
            const error = new Error('Wrong: Email id or Password');
            error.statusCode = 401;
            throw error;
        }

        

        return availableUser;

    } catch (error) {
        console.log(error);
        throw error;
    }
}
module.exports = {
    addNewUser,
    tryLoginUser

}