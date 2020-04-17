// configure dotenv
require('dotenv').config()
// require('dotenv').load();

var express = require('express');
var server = express();               //'const'
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var middleware = require('./middleware');
var flash = require('connect-flash'); //express session sets up a lot of this already
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//REMEMBER TO DEFINE THIS SHIT BEFORE ROUTES, moron
server.use(bodyParser.urlencoded({extended: true}));
server.use(methodOverride('_method'));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + "/public"))
server.use(flash());

LocalStrategy = require('passport-local');
Team = require('./models/team');
Player = require('./models/player');
Game = require('./models/game');


//passport config
server.use(session({
  secret:'jaxidingo',
  resave: false,
  saveUninitialized: false
}))

server.use(passport.initialize());
server.use(passport.session());
passport.use(new LocalStrategy(Player.authenticate()));
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());


server.use(function(req, res, next){
   res.locals.currentUser = req.user;
    // console.log('res.locals.currentUser: '+res.locals.currentUser)
    // console.log('req.user: '+req.user)
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
   next();
});


var teamRoutes = require('./routes/teams');
var playerRoutes = require('./routes/players');
var gameRoutes = require('./routes/games');

server.use("/teams",teamRoutes);
server.use("/players", playerRoutes);
server.use("/games",gameRoutes);


//-------<[ LOCAL DEVELOPMENT DATABASE ]
mongoose.connect("mongodb://localhost:27017/noprodb",
{ useUnifiedTopology: true, useNewUrlParser: true});
// -------<[ HEROKU/MONGO DEPLOYED DATABASE ]
// mongoose.connect(process.env.DATABASEURL,{ useUnifiedTopology: true, useNewUrlParser: true});
// app.use(bodyParser.urlencoded({extended: true}));


//display the basic home page no login required
server.get('/' , function(req, res){
  res.render('index.ejs');
});


server.post('/login',
passport.authenticate('local',
 { //this is being "used" in passport.use()
  successRedirect: '/',
  failureRedirect: '/signup'
}),
  function(req, res){
  // res.render('index.ejs'); //redirect back to '/' now logged in.
});

//
// server.post('/register' , function(req, res){
//   console.log('player creation info about to be entered: req.body:'+JSON.stringify(req.body));
//   if (req.body.admincode === "admin") {req.body.isAdmin = true;}
//   if (req.body.captaincode === "cap") {req.body.isCaptain = true;}
//   if (req.body.gender === "Male") {req.body.image = 'https://i.imgur.com/lgMFKR7.png';}
//
//   var newPlayer = {
//     username: req.body.username, //user enters 'email'
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     gender: req.body.gender,
//     image: req.body.image,
//     team: req.body.team,
//     isAdmin: req.body.isAdmin,
//     isCaptain: req.body.isCaptain
//   }
//
//   Player.register(newPlayer, req.body.password, function(err, newPlayer){
//     if(err){
//       console.log('new player root creation error: ' + err);
//       req.flash("error", err.message);
//       res.redirect('/signup')
//     } else {
//       passport.authenticate('local')(req, res, function(){
//         console.log("new player registered (logged in) and + database :" + JSON.stringify(newPlayer))
//         req.flash("success", "New Player has been Created! Woot motherfuckin, WOOT");
//         res.redirect("/");
//       })
//     }
//   })
// });

server.get('/signup' , function(req, res){
    Team.find({}, function(err, allTeams){
      if(err){
          console.log("all teams find error at signup route: " + err);
      } else {
        res.render('signup.ejs',{teams : allTeams} );
      }
  });
  })

  server.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
  });







  // forgot password route & init user route



  server.get('/init', function(req, res) {
    res.render('init');
  });

  server.post('/init', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        Player.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            var newPlayer = {
              username: req.body.username, //user enters 'email'
            }
            var tempPassword = "tempassword"

            Player.register(newPlayer, tempPassword, function(err, newPlayer){
              if(err){console.log('new player init route error: ' + err);}
              else {
              console.log('new player registered with just this info:' + newPlayer)
                  // res.redirect("/init");
                  Player.findOne({ username: req.body.username }, function(err, user) {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                      console.log('found a player: '+user.username+ ' setting a token')
                      done(err, token, user);
                    });

                  })



                }
                })




            // console.log('error on the Player findOne username')
            // req.flash('error', 'No account with that email address exists.');
            return res.render('confirm');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            console.log('found a player: '+user.username+ ' setting a token')
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'kevin@noprosports.org',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: 'kevin@noprosports.org',
          subject: 'NoPro Sports Password Reset',
          text: 'You are receiving this because you (or someone else) have requested a reset or initial password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please disregard this email.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/init');
    });
  });

  server.get('/reset/:token', function(req, res) {
    Player.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/init');
      }
      res.render('reset', {token: req.params.token});
    });
  });

  server.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Player.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;

              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'kevin@noprosports.org',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.username,
          from: 'kevin@noprosports.org',
          subject: 'Your new password has been set',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.username + ' has just been set.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {


      res.redirect('/signup');
    });
  });


  // END forgot password route & init user route




server.set('port', (process.env.PORT || 3000));
server.listen(server.get('port'),
function(){console.log('server: running motherfuckers! port: ' + server.get('port'));});
