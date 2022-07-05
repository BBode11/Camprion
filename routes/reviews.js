const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const reviews = require('../controllers/reviews');
const Review = require('../models/review.js');
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


//Post request for reviews based on campground ID
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Delete request for reviews based on ID
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;