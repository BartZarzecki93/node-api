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
const Bootcamps = require('../models/Bootcamps');

//Include other resources routers

const courseRouter = require('./courses');

//Routes
const router = express.Router();

//Re-route into other resources
router.use('/:bootcampId/courses', courseRouter);

router
	.route('/radius/:zipcode/:distance')
	.get(getBootcampsInRadius);

router
	.route('/:id/photo')
	.put(bootcampPhotoUpload);

router
	.route('/')
	.get(
		advancedResults(Bootcamps, 'courses'),
		getBootcamps
	)
	.post(createBootcamp);

router
	.route('/:id')
	.put(updateBootcamp)
	.delete(deleteBootcamps)
	.get(getBootcamp);

module.exports = router;
