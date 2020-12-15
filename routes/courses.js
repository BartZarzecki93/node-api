import { Router } from 'express';
import advancedResults from '../middleware/advancedResults';
//Controllers
import {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} from '../controllers/courses';
import Courses from '../models/Courses';
import {
	protect,
	authorize,
} from '../middleware/auth';

//Routes
const router = Router({
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

export default router;
