import { Router } from 'express';
import {
	getReviews,
	getReview,
	addReview,
	updateReview,
	deleteReview,
} from '../controllers/reviews';

import Review from '../models/Reviews';

const router = Router({
	mergeParams: true,
});

import advancedResults from '../middleware/advancedResults';
import {
	protect,
	authorize,
} from '../middleware/auth';

router
	.route('/')
	.get(
		advancedResults(Review, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getReviews
	)
	.post(
		protect,
		authorize('user', 'admin'),
		addReview
	);

router
	.route('/:id')
	.get(getReview)
	.put(
		protect,
		authorize('user', 'admin'),
		updateReview
	)
	.delete(
		protect,
		authorize('user', 'admin'),
		deleteReview
	);

export default router;
