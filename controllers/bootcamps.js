const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocdoer');
const dotenv = require('dotenv');
const path = require('path');
//load env
dotenv.config({
	path: './config/config.env',
});

//@desc       Get all bootcamps
//@route      GET /api/v1/bootcamps
//@access     Public

exports.getBootcamps = asyncHandler(
	async (req, res, next) => {
		res.status(200).json(res.advancedResults);
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
				new ErrorResponse(
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
		//Add user to body
		req.body.user = req.user.id;

		// Check for published bootcamp
		const publishedBootcamp = await Bootcamp.findOne(
			{ user: req.user.id }
		);

		// If the user is not an admin, they can only add one bootcamp
		if (
			publishedBootcamp &&
			req.user.role !== 'admin'
		) {
			return next(
				new ErrorResponse(
					`The user with ID ${req.user.id} has already published a bootcamp`,
					400
				)
			);
		}

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
		const bootcamp = await Bootcamp.findById(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
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
					`User ${req.params.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}

		bootcamp = await Bootcamp.findOneAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

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
		const bootcamp = await Bootcamp.findById(
			req.params.id
		);
		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
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
					`User ${req.params.id} is not authorized to delete this bootcamp`,
					401
				)
			);
		}

		bootcamp.remove();
		res.status(200).json({
			success: true,
			msg: `Delete bootcamp ${req.params.id}`,
			data: {},
		});
	}
);

//@desc       Get bootcamps within a radius
//@route      GET /api/v1/bootcamps/:zipcode/:distance
//@access     Public

exports.getBootcampsInRadius = asyncHandler(
	async (req, res, next) => {
		const { zipcode, distance } = req.params;

		//Get lang and lat geocoder
		const loc = await geocoder.geocode(zipcode);
		const lat = loc[0].latitude;
		const lng = loc[0].longitude;

		const radius = distance / 3963;

		const bootcamps = await Bootcamp.find({
			location: {
				$geoWithin: {
					$centerSphere: [
						[lng, lat],
						radius,
					],
				},
			},
		});

		res.status(200).json({
			success: true,
			count: bootcamps.length,
			data: bootcamps,
		});
	}
);

//@desc       Upload photo for bootcamp
//@route      PUT /api/v1/bootcamps/:id/photo
//@access     Public

exports.bootcampPhotoUpload = asyncHandler(
	async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(
			req.params.id
		);
		if (!bootcamp) {
			return next(
				new ErrorResponse(
					`Bootcamp not found with id of ${req.params.id}`,
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
					`User ${req.params.id} is not authorized to upload for this bootcamp`,
					401
				)
			);
		}

		if (!req.files) {
			return next(
				new ErrorResponse(
					'Please upload file',
					400
				)
			);
		}

		const file = req.files.file;

		// Make sure the image is a photo
		if (!file.mimetype.startsWith('image')) {
			return next(
				new ErrorResponse(
					`Please upload an image file`,
					400
				)
			);
		}

		// Check filesize
		if (
			file.size > process.env.MAX_FILE_UPLOAD
		) {
			return next(
				new ErrorResponse(
					`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
					400
				)
			);
		}

		// Create custom filename
		file.name = `photo_${bootcamp._id}${
			path.parse(file.name).ext
		}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/${file.name}`,
			async (err) => {
				if (err) {
					console.error(err);
					return next(
						new ErrorResponse(
							`Problem with file upload`,
							500
						)
					);
				}

				await Bootcamp.findByIdAndUpdate(
					req.params.id,
					{ photo: file.name }
				);

				res.status(200).json({
					success: true,
					msg: `File uploaded`,
				});
			}
		);
	}
);
