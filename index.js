var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var server = require('http').createServer(app);
server.listen(process.env.PORT || 2009);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var signinRouter = require('./routes/signin');
var signupRouter = require('./routes/signup');
var homeRouter = require('./routes/home');
var videocallRouter = require('./routes/videocall');
var contactRouter = require('./routes/contact');
var profileRouter = require('./routes/profile');
var editprofileRouter = require('./routes/editprofile');
var resetpassRouter = require('./routes/resetpass');



app.use('/', signinRouter);
app.use('/signup', signupRouter);
app.use('/home', homeRouter);
app.use('/videocall', videocallRouter);
app.use('/contact', contactRouter);
app.use('/profile', profileRouter);
app.use('/editprofile', editprofileRouter);
app.use('/resetpass', resetpassRouter);

module.exports = app;