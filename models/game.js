// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
  date: {
    time: String,
    month: String,
    day: String,
  },
  //make a field image with the number on the img
  field: String,
  // teams: [{type:mongoose.Schema.Types.ObjectId, ref: "Team"}]
  home: String,
  away: String,
  homescore: Number,
  awayscore: Number,
});

var Game = mongoose.model("Game", gameSchema);
module.exports = Game;
