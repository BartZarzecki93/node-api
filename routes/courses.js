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
	.post(createCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(updateCourse)
	.delete(deleteCourse);

module.exports = router;
