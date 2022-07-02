const mongoose = require('mongoose');
const { Schema } = mongoose;

//Defined schema for campground reviews
const ReviewSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model('Review', ReviewSchema)