
const router = require('express').Router();
const { addUser, getMe, login, logout } = require('../controller/userController');
const auth = require('../middleware/auth');
const formValidation = require('../middleware/formValidation');
const { loginSchema, signupSchema } = require('../schemas/userSchema');

router.post('/add-user', formValidation(signupSchema), addUser);
router.post('/login-user', formValidation(loginSchema), login);
router.get('/current-user', auth, getMe);
router. post('/logout', logout);

module.exports = router;