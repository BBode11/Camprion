const mongoose = require('mongoose');
const { Schema } = mongoose;

//defined starting Campground schema
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);