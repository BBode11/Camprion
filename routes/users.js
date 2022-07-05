const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    //Rendering register form
    .get(users.renderRegister)
    //Registers the user
    .post(catchAsync(users.register));

router.route('/login')
    //Renders the login page
    .get(users.renderLogin)
    //Creates the post request for loggin in and authenticates with Passport
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

//Logs the user out
router.get('/logout', users.logout);

module.exports = router;