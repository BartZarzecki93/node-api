import { Router } from 'express';

//Controllers
import {
	getBootcamps,
	getBootcamp,
	deleteBootcamps,
	updateBootcamp,
	createBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} from '../controllers/bootcamps';

import advancedResults from '../middleware/advancedResults';
import {
	protect,
	authorize,
} from '../middleware/auth';
import Bootcamps from '../models/Bootcamps';

//Include other resources routers

import courseRouter from './courses';

//Routes
const router = Router();

//Re-route into other resources
router.use('/:bootcampId/courses', courseRouter);

router
	.route('/radius/:zipcode/:distance')
	.get(getBootcampsInRadius);

router
	.route('/:id/photo')
	.put(
		protect,
		authorize('publisher', 'admin'),
		bootcampPhotoUpload
	);

router
	.route('/')
	.get(
		advancedResults(Bootcamps, 'courses'),
		getBootcamps
	)
	.post(
		protect,
		authorize('publisher', 'admin'),
		createBootcamp
	);

router
	.route('/:id')
	.put(
		protect,
		authorize('publisher', 'admin'),
		updateBootcamp
	)
	.delete(
		protect,
		authorize('publisher', 'admin'),
		deleteBootcamps
	)
	.get(getBootcamp);

export default router;
