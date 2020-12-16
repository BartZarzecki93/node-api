const express = require('express');

//Controllers
const {
	getBootcamps,
	getBootcamp,
	deleteBootcamps,
	updateBootcamp,
	createBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const advancedResults = require('../middleware/advancedResults');
const {
	protect,
	authorize,
} = require('../middleware/auth');
const Bootcamps = require('../models/Bootcamps');

//Include other resources routers

const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
//Routes
const router = express.Router();

//Re-route into other resources
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

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

module.exports = router;
