var mongoose = require('./bdd');


//schema users mongoDB
var journeysSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
});

//journeysModel
var journeysModel = mongoose.model('journeys', journeysSchema);

module.exports = journeysModel;