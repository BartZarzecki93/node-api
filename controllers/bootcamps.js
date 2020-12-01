const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc       Get all bootcamps
//@route      GET /api/v1/bootcamps
//@access     Public

exports.getBootcamps = asyncHandler(
	async (req, res, next) => {
		const bootcamps = await Bootcamp.find();

		res.status(200).json({
			success: true,
			msg: 'Show all bootcamps',
			count: bootcamps.length,
			data: bootcamps,
		});
	}
);

//@desc       Get single bootcamp
//@route      GET /api/v1/bootcamps/:id
//@access     Public

exports.getBootcamp = asyncHandler(
	async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(
			req.params.id
		);
		if (!bootcamp) {
			return next(
				ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
					404
				)
			);
		}
		res.status(200).json({
			success: true,
			msg: `Show a boootcamp ${req.params.id}`,
			data: bootcamp,
		});
	}
);

//@desc       Create bootcamp
//@route      POST /api/v1/bootcamps
//@access     Public

exports.createBootcamp = asyncHandler(
	async (req, res, next) => {
		const bootcamp = await Bootcamp.create(
			req.body
		);

		res.status(201).json({
			success: true,
			msg: 'Create new bootcamp',
			data: bootcamp,
		});
	}
);

//@desc       Update bootcamp
//@route      PUT /api/v1/bootcamps/:id
//@access     Public

exports.updateBootcamp = asyncHandler(
	async (req, res, next) => {
		const bootcamp = await Bootcamp.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!bootcamp) {
			return next(
				ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
					404
				)
			);
		}

		res.status(200).json({
			success: true,
			msg: `Update bootcamp ${req.params.id}`,
			data: bootcamp,
		});
	}
);

//@desc       Delete bootcamp
//@route      GET /api/v1/bootcamps/:id
//@access     Public

exports.deleteBootcamps = asyncHandler(
	async (req, res, next) => {
		const bootcamp = await Bootcamp.findByIdAndDelete(
			req.params.id
		);
		if (!bootcamp) {
			return next(
				ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
					404
				)
			);
		}
		res.status(200).json({
			success: true,
			msg: `Delete bootcamp ${req.params.id}`,
			data: {},
		});
	}
);