const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkDay = new Schema({
  _id: String,
  month: String,
  countDay: {
    type: Number,
    default: 0
  }
});
module.exports = mongoose.model("WorkDay", WorkDay);
