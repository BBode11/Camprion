//Required statements
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/expressError');


//Setup for routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');



//Setup for the mongo database on localhost
mongoose.connect('mongodb://localhost:27017/camprion');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();

//Set the view engine to ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

//Rendering the home.ejs file within the views directory
app.get('/', function (req, res) {
    res.render('home');
});

app.all('*', (res, req, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//Generic error handler function
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something happened...but it was not good. "
    res.status(statusCode).render('error', { err });
});

//Started the app with nodemon on port 3000
app.listen(3000, () => {
    console.log("On port 3000!!");
});