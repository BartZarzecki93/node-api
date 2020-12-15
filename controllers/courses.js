import Course from '../models/Courses';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import Bootcamps from '../models/Bootcamps';

export const getCourses = asyncHandler(
	async (req, res, next) => {
		if (req.params.bootcampId) {
			const courses = await Course.find({
				bootcamp: req.params.bootcampId,
			});

			return res.status(200).json({
				success: true,
				count: courses.length,
				//	pagination,
				data: courses,
			});
		} else {
			res.status(200).json(
				res.advancedResults
			);
		}
	}
);

export const getCourse = asyncHandler(
	async (req, res, next) => {
		const course = await Course.findById(
			req.params.id
		).populate({
			path: 'bootcamp',
			select: 'name description',
		});

		if (!course) {
			return next(
				new ErrorResponse(
					`No course with the id of ${req.params.id}`,
					404
				)
			);
		}

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

export const createCourse = asyncHandler(
	async (req, res, next) => {
		req.body.bootcamp = req.params.bootcampId;
		req.body.user = req.user.id;

		const bootcamp = await Bootcamps.findById(
			req.params.bootcampId
		);

		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`No bootcamp with the id of ${req.params.bootcampId}`,
					404
				)
			);
		}

		// Make sure user is bootcamp owner
		if (
			bootcamp.user.toString() !==
				req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to add this course`,
					401
				)
			);
		}

		const course = await Course.create(
			req.body
		);

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

export const updateCourse = asyncHandler(
	async (req, res, next) => {
		let course = await Course.findById(
			req.params.id
		);
		if (!course) {
			return next(
				new ErrorResponse(
					`Course not found with the id of ${req.params.bootcampId}`,
					404
				)
			);
		}

		// Make sure user is course owner
		if (
			course.user.toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to update this course`,
					401
				)
			);
		}

		course = await Course.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			success: true,
			data: course,
		});
	}
);

export const deleteCourse = asyncHandler(
	async (req, res, next) => {
		let course = await Course.findById(
			req.params.id
		);
		if (!course) {
			return next(
				new ErrorResponse(
					`Course not found with the id of ${req.params.bootcampId}`,
					404
				)
			);
		}

		// Make sure user is course owner
		if (
			course.user.toString() !== req.user.id &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`User ${req.user.id} is not authorized to delete this course`,
					401
				)
			);
		}

		await course.remove();

		res.status(200).json({
			success: true,
			msg: `Delete bootcamp ${req.params.id}`,
			data: {},
		});
	}
);
