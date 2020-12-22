import { Router } from 'express';

//Controllers
import {
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
} from '../controllers/auth';
import { protect } from '../middleware/auth';

//Routes
const router = Router();

router.route('/register').post(register);

router.route('/login').post(login);
router.get('/logout', logout);

router.route('/me').get(protect, getMe);

router
	.route('/forgotpassword')
	.post(forgotPassword);

router
	.route('/resetpassword/:resettoken')
	.put(resetPassword);

router
	.route('/updatedetails')
	.put(protect, updateDetails);

router
	.route('/updatepassword')
	.put(protect, updatePassword);

export default router;
