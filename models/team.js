// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
   name: String,
   captain: String,
   image: {type: String, default: "https://i.imgur.com/yqQeqcI.png"},
   record: {
     w: {type: Number, default: 0},
     l: {type: Number, default: 0},
     t: {type: Number, default: 0},
     pct: {type: Number, default: 0},
     ps: {type: Number, default: 0},
     psa: {type: Number, default: 0},
    }
});

var Team = mongoose.model("Team", teamSchema);
module.exports = Team;
