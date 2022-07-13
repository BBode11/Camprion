const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    //Rendering campgrounds/index.js file within views directory
    .get(catchAsync(campgrounds.index))
    //Post request for saving newly created campgrounds
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.create));


//Rendering create form for campgrounds
router.get('/create', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    //Rendering campground based on ID
    .get(catchAsync(campgrounds.showCampground))
    //Put request for updating campgrounds by ID
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    //Delete request for campgrounds by ID
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//Rendering edit form for campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;