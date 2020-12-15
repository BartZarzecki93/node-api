import { verify } from 'jsonwebtoken';
import asyncHandler from './async';
import ErrorResponse from '../utils/errorResponse';
import User from '../models/Users';

export const protect = asyncHandler(
	async (req, res, next) => {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith(
				'Bearer'
			)
		) {
			// Set token from Bearer token in header
			token = req.headers.authorization.split(
				' '
			)[1];
			// Set token from cookie
		}

		// Make sure token exists
		if (!token) {
			return next(
				new ErrorResponse(
					'Not authorized to access this route',
					401
				)
			);
		}

		try {
			// Verify token
			const decoded = verify(
				token,
				process.env.JWT_SECRET
			);

			req.user = await User.findById(
				decoded.id
			);

			next();
		} catch (err) {
			return next(
				new ErrorResponse(
					'Not authorized to access this route',
					401
				)
			);
		}
	}
);

// Grant access to specific roles
export function authorize(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			);
		}
		next();
	};
}
