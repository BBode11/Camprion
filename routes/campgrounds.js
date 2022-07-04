const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

//Rendering campgrounds/index.js file within views directory
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
}));

//Rendering create form for campgrounds
router.get('/create', isLoggedIn, (req, res) => {
    res.render('campgrounds/create');
});

//Post request for saving newly created campgrounds
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Rendering campground based on ID
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Unable to find the campground you are looking for.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

//Rendering edit form for campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Unable to find the campground you are looking for.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

//Put request for updating campgrounds by ID
router.put('/:id', isLoggedIn, validateCampground, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully updated ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete request for campgrounds by ID
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your campground');
    res.redirect('/campgrounds');
}));

module.exports = router;