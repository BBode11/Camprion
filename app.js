//Required express, mongoose, and path
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

//Setup for the mongo database on localhost
mongoose.connect('mongodb://localhost:27017/camprion');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

const app = express();


//Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Rendering the home.ejs file within the views directory
app.get('/', function (req, res) {
    res.render('home');
});

//Seed data for creating a campground
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: 'Whispering Pine',
        description: 'Cheap camping near TC.'
    });
    await camp.save();
    res.send(camp);
});

//Started the app with nodemon on port 3000
app.listen(3000, () => {
    console.log("On port 3000!!");
});