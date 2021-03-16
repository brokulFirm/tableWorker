const mongoose = require("mongoose");
const { Schema } = mongoose;

const Worker = new Schema({
  name: String,
  lastName: String,
  startDate: String,
  rate: Number,
  shift: String,
  number: String,
  medicalBoard: String
});
module.exports = mongoose.model("Worker", Worker);
