const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkDay = new Schema({
  _id: String,
  name: String,
  lastName: String,
  shift: String,
  rate: Number,
  month: String,
  countDay: [String]
});
module.exports = mongoose.model("WorkDay", WorkDay, "testworkdays"); //УБРАТЬ ТЕСТЫ ПРИ СБОРКЕ НА ПРОДАКШН
