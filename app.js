//Required express, mongoose, path, and override
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

//Rendering the home.ejs file within the views directory
app.get('/', function (req, res) {
    res.render('home');
});

//Rendering campgrounds/index.js file within views directory
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
});

//Rendering create form for campgrounds
app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create');
});

//Post request for saving newly created campgrounds
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

//Rendering campground based on ID
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
});

//Rendeing edit form for campgrounds
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
});

//Put request for updating campgrounds by ID
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

//Delete request for campgrounds by ID
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


//Started the app with nodemon on port 3000
app.listen(3000, () => {
    console.log("On port 3000!!");
});