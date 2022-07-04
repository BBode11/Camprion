const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');


//Middleware for validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Rendering campgrounds/index.js file within views directory
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
}));

//Rendering create form for campgrounds
router.get('/create', (req, res) => {
    res.render('campgrounds/create');
});

//Post request for saving newly created campgrounds
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', `Successfully created ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Rendering campground based on ID
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Unable to find the campground you are looking for.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

//Rendering edit form for campgrounds
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Unable to find the campground you are looking for.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

//Put request for updating campgrounds by ID
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully updated ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete request for campgrounds by ID
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your campground');
    res.redirect('/campgrounds');
}));

module.exports = router;