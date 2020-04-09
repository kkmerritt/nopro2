// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
   firstname: String,
   lastname: String,
   team: String
   // image: String,
   // email: String,
   // phone: String,
   // captain: {type: Boolean, default: false},
   // admin: {type: Boolean, default: false},
   // team: {
   //   id: {
   //     type: mongoose.Schema.Types.ObjectId,
   //     ref: "Team"
   //   },
   //    name: String
   // },

});

var Player = mongoose.model("Player", playerSchema);

module.exports = Player;
