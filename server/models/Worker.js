const mongoose = require("mongoose");
const { Schema } = mongoose;

const Worker = new Schema({
  name: String,
  lastName: String,
  startDate: Date,
  rate: Number,
  shift: String
});
module.exports = mongoose.model("Worker", Worker);
