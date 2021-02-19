const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  wasted: {
    type: Number,
  },
  pack: {
    type: Object,
  },
});
module.exports = mongoose.model("User", User);
