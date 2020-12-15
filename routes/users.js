const express = require('express');
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/users');

const Users = require('../models/Users');

const router = express.Router({
	mergeParams: true,
});

const advancedResults = require('../middleware/advancedResults');
const {
	protect,
	authorize,
} = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
	.route('/')
	.get(advancedResults(Users), getUsers)
	.post(createUser);

router
	.route('/:id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser);

module.exports = router;
