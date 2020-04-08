require('dotenv').config()
var express = require('express');
var server = express();               //'const'
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var middleware = require('./middleware');
var flash = require('connect-flash');


//LocalStrategy = require('passport-local');
 Team = require('./models/team');
 Player = require('./models/player');

var teamRoutes = require('./routes/teams');
var playerRoutes = require('./routes/players');
server.use("/teams",teamRoutes);
server.use("/players", playerRoutes);


//-------<[ LOCAL DEVELOPMENT DATABASE ]
mongoose.connect("mongodb://localhost:27017/noprodb",
{ useUnifiedTopology: true, useNewUrlParser: true});
// -------<[ HEROKU/MONGO DEPLOYED DATABASE ]
// mongoose.connect(process.env.DATABASEURL,{ useUnifiedTopology: true, useNewUrlParser: true});
// app.use(bodyParser.urlencoded({extended: true}));

server.use(bodyParser.urlencoded({extended: true}));
server.use(methodOverride('_method'));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + "/public"))
//app.use(flash());

server.get('/' , function(req, res){
  res.render('index.ejs');
});

server.get('/login' , function(req, res){
  res.render('index.ejs');
});

server.get('/' , function(req, res){
  res.render('index.ejs');
});


server.listen(3000)






console.log('connected motherfucker!')
