const express = require('express');
const advancedResults = require('../middleware/advancedResults');
//Controllers
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const Courses = require('../models/Courses');
const {
	protect,
	authorize,
} = require('../middleware/auth');

//Routes
const router = express.Router({
	mergeParams: true,
});

router
	.route('/')
	.get(
		advancedResults(Courses, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(
		protect,
		authorize('publisher', 'admin'),
		createCourse
	);

router
	.route('/:id')
	.get(getCourse)
	.put(
		protect,
		authorize('publisher', 'admin'),
		updateCourse
	)
	.delete(
		protect,
		authorize('publisher', 'admin'),
		deleteCourse
	);

module.exports = router;