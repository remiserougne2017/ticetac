var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var models = require('./routes/index')
var usersRouter = require('./routes/users');
var bdd = require('./models/bdd');

var app = express();

// app.locals.firstLetterUp = function(ville) {
//     return ville.charAt(0).toUpperCase() + ville.slice(1)
// };

// console.log(firstLetterUp("paris"))

app.locals.dateFormat = function(date) {
    var newDate = new Date(date)
    var format = date.getDate() + "/" + (date.getMonth() + 1) + '/' + date.getFullYear();
    return format
}

var session = require("express-session");




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'a4f8071f-c873-4447-8ee2',
        resave: false,
        saveUninitialized: false,
    })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;