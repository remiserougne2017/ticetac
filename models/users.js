var mongoose = require('./bdd');

// // schema travel
// var travelSchema = mongoose.Schema({
//     title: Strin
// })

//schema users mongoDB
var usersSchema = mongoose.Schema({
    firstName: String,
    name: String,
    email: String,
    password: String,
    journey: [{ type: mongoose.Schema.Types.ObjectId, ref: 'journey' }]
});

//usersModel
var usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;