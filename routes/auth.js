const express = require('express');

//Controllers
const {
	register,
	login,
	getMe,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

//Routes
const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

module.exports = router;
