// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var playerSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  password: String,
  firstname: String,
  lastname: String,
  gender: String,
  team: {type: String, default: "Free Agent"},
  image: {type: String, default: 'https://i.imgur.com/T1Fn4h5.png'},
  isAdmin: {type: Boolean, default: false},
  isCaptain: {type: Boolean, default: false},
});

playerSchema.plugin(passportLocalMongoose);

var Player = mongoose.model("Player", playerSchema);

module.exports = Player;
