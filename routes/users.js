import { Router } from 'express';
import {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from '../controllers/users';

import Users from '../models/Users';

const router = Router({
	mergeParams: true,
});

import advancedResults from '../middleware/advancedResults';
import {
	protect,
	authorize,
} from '../middleware/auth';

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

export default router;
