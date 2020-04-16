// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
  date: Date,
  //make a field image with the number on the img
  field: String,
  // teams: [{type:mongoose.Schema.Types.ObjectId, ref: "Team"}]
  teams: String
});

var Game = mongoose.model("Game", gameSchema);
module.exports = Game;
