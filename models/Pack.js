const mongoose = require("mongoose");

const Pack = new mongoose.Schema({
  packName: {
    type: String,
    required: true,
    max: 255,
  },
  packSize: {
    type: Number,
    required: true,
  },
  packCost: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Pack", Pack);
