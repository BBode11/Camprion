const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//Rendering campgrounds/index.js file within views directory
router.get('/', catchAsync(campgrounds.index));

//Rendering create form for campgrounds
router.get('/create', isLoggedIn, campgrounds.renderNewForm);

//Post request for saving newly created campgrounds
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.create));

//Rendering campground based on ID
router.get('/:id', catchAsync(campgrounds.showCampground));

//Rendering edit form for campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//Put request for updating campgrounds by ID
router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(campgrounds.updateCampground));

//Delete request for campgrounds by ID
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;