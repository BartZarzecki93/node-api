const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const dotenv = require('dotenv');
const path = require('path');
const Users = require('../models/Users');

//load env
dotenv.config({
	path: './config/config.env',
});

//@desc       Register User
//@route      POST /api/v1/auth/register
//@access     Public

exports.register = asyncHandler(
	async (req, res, next) => {
		const {
			name,
			email,
			password,
			role,
		} = req.body;

		const user = await Users.create({
			name,
			email,
			password,
			role,
		});

		sendTokenResponse(user, 200, res);
	}
);

//@desc       Login User
//@route      POST /api/v1/auth/login
//@access     Public

exports.login = asyncHandler(
	async (req, res, next) => {
		const { email, password } = req.body;

		//Validate email and pass
		if (!email || !password) {
			return next(
				new ErrorResponse(
					'Please provide an email and password',
					400
				)
			);
		}

		//Check for a user
		const user = await Users.findOne({
			email: email,
		}).select('+password');

		if (!user) {
			return next(
				new ErrorResponse(
					'User do not exist/Invalid credentials',
					401
				)
			);
		}

		//Check password
		const isMatch = await user.matchPassword(
			password
		);

		if (!isMatch) {
			return next(
				new ErrorResponse(
					'Invalid credentials',
					401
				)
			);
		}

		sendTokenResponse(user, 200, res);
	}
);

//@desc       Get current logged user
//@route      POST /api/v1/auth/me
//@access     Private

exports.getMe = asyncHandler(
	async (req, res, next) => {
		const user = await Users.findById(
			req.user._id
		);

		res.status(200).json({
			success: true,
			data: user,
		});
	}
);

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public

exports.forgotPassword = asyncHandler(
	async (req, res, next) => {}
);

// Get token from model, create cookie and send response
const sendTokenResponse = (
	user,
	statusCode,
	res
) => {
	// Create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRE *
					24 *
					60 *
					60 *
					1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			token,
		});
};
