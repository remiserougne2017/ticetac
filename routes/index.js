var express = require('express');
var router = express.Router();
//RS appel BDD
const mongoose = require('mongoose');

//RS Model de user 
var usersModel = require('../models/users');
var journeysModel = require('../models/journeys');

//RS variable login
var errorTab = []
var mess = ""
var mess1 = ""
var email = ""


/*Signup */
router.post('/signup', async function(req, res, next) {
    console.log(req.session)
        //Enregistrement nouveau user
    var newUser = new usersModel({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: req.body.password
    });
    var userSaved = await newUser.save();
    // MAJ de la req.session
    req.session.userId = userSaved._id;
    req.session.email = userSaved.email;
    req.session.username = userSaved.username
    req.session.log = true
    req.session.panierUser = []
    console.log(userSaved)

    res.redirect('/home');
});


/*Signin */
router.post('/signin', async function(req, res, next) {

    console.log("hey signin : ", req.body, "session!", req.session)
    var login = await usersModel.findOne({ email: req.body.email, password: req.body.password });
    console.log("login", login)
    if (login == null) {
        console.log('if signin')
        mess = "Email or pwd invalid"
        res.render('login', { mess, mess1, email })
    } else {

        req.session.userId = login._id
        req.session.email = login.email
        req.session.username = login.username
        req.session.log = true
        req.session.panierUser = []
        console.log("he session", req.session);
        res.redirect('/home')
    };
});

/*GET log out */
router.get('/logout', function(req, res, next) {
    panierBackend = []
    res.redirect('/');
});

/* GET login page. */
router.get('/', function(req, res, next) {

    console.log("Hey Redirect : ", req.session)
    res.render('login', );
});

/* GET home page. */
router.get('/home', function(req, res, next) {
    res.render('calendar', { title: 'Express' });
});


/* POST result page. */
router.post('/go', async function(req, res, next) {

    console.log("go page result", req.body)
        //premeire lettre en uppercase
    var firstLetterUp = function(ville) {
        return ville.charAt(0).toUpperCase() + ville.slice(1)
    };
    var train = await journeysModel.find({ departure: firstLetterUp(req.body.fromCity), arrival: firstLetterUp(req.body.toCity), date: req.body.date })
    if (train.length == 0) {
        res.render('errorpage');
    } else {
        res.render('result', { train });
    };
    // var date = dateFormat(req.body.date)
    // dateJourMois = req.body.date + "/" + req.body.date
});

var panierBackend = []
    /* GET panier page. */
router.get('/mytickets', async function(req, res, next) {
    console.log("query : ", req.query)

    // req.session.journey.push(req.query.id)
    panierBackend.push(await journeysModel.findById(req.query.id))
    req.session.panierUser.push(panierBackend[panierBackend.length - 1]._id)
    console.log("heo session", panierBackend)
    res.render('mytickets', { panierFront: panierBackend });
});

/* GET confim page. */
router.get('/confirm', async function(req, res, next) {

    await usersModel.updateOne({ _id: req.session.userId }, { journey: req.session.panierUser })
    req.session.panierUser = []
    res.redirect('/lastTrips');
});


/* GET last trips page. */
router.get('/lastTrips', async function(req, res, next) {

    var trajetUser = await usersModel.findById(req.session.userId).populate('journey').exec();

    console.log("tra : ", trajetUser)
    res.render('lastTrips', { trajet: trajetUser.journey });
});

/* GET error page. */
router.get('/error', function(req, res, next) {
    res.render('errorpage', { title: 'Express' });
});




// useNewUrlParser ;)
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://jeremy:azerty@cluster0-zdsx4.mongodb.net/ticetac?retryWrites=true&w=majority',
    options,
    function(err) {
        if (err) {
            console.log(`error, failed to connect to the database because --> ${err}`);
        } else {
            console.info('*** Database Ticketac connection : Success ***');
        }
    }
);

var journeySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
});

var journeyModel = mongoose.model('journey', journeySchema);

var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"]
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"]


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

    // How many journeys we want
    var count = 300

    // Save  ---------------------------------------------------
    for (var i = 0; i < count; i++) {

        departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
        arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

        if (departureCity != arrivalCity) {

            var newUser = new journeyModel({
                departure: departureCity,
                arrival: arrivalCity,
                date: date[Math.floor(Math.random() * Math.floor(date.length))],
                departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
                price: Math.floor(Math.random() * Math.floor(125)) + 25,
            });

            await newUser.save();

        }

    }
    res.render('index', { title: 'Express' });
});



module.exports = router;