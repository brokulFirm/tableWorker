const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkDayInYear = new Schema({
  _id: String,
  name: String,
  lastName: String,
  shift: String,
  rate: Number,
  year: String,
  month: {}
});
module.exports = mongoose.model(
  "WorkDayInYear",
  WorkDayInYear,
  "testworkdayinyears"
);
//УБРАТЬ ТЕСТЫ ПРИ СБОРКЕ НА ПРОДАКШН
