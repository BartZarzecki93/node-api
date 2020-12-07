const express = require('express');

//Controllers
const {
	getBootcamps,
	getBootcamp,
	deleteBootcamps,
	updateBootcamp,
	createBootcamp,
	getBootcampsInRadius,
} = require('../controllers/bootcamps');

//Routes
const router = express.Router();

router
	.route('/radius/:zipcode/:distance')
	.get(getBootcampsInRadius);

router
	.route('/')
	.get(getBootcamps)
	.post(createBootcamp);

router
	.route('/:id')
	.put(updateBootcamp)
	.delete(deleteBootcamps)
	.get(getBootcamp);

module.exports = router;
