const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkDayInYear = new Schema({
  _id: String,
  name: String,
  lastName: String,
  year: String,
  month: {
    "01": {
      type: Number,
      default: 0
    },
    "02": {
      type: Number,
      default: 0
    },
    "03": {
      type: Number,
      default: 0
    },
    "04": {
      type: Number,
      default: 0
    },
    "05": {
      type: Number,
      default: 0
    },
    "06": {
      type: Number,
      default: 0
    },
    "07": {
      type: Number,
      default: 0
    },
    "08": {
      type: Number,
      default: 0
    },
    "09": {
      type: Number,
      default: 0
    },
    "10": {
      type: Number,
      default: 0
    },
    "11": {
      type: Number,
      default: 0
    },
    "12": {
      type: Number,
      default: 0
    }
  }
});
module.exports = mongoose.model("WorkDayInYear", WorkDayInYear);
