const mongoose = require("mongoose");
const { Schema } = mongoose;

const Vacation = new Schema({
  _id: String,
  year: String,
  name: String,
  lastName: String,
  vacDay: Number,
  sickLeave: Array,
  dayOff: Array,
  notPlanned: Array,
  holidays: Array
});
module.exports = mongoose.model("Vacation", Vacation, "testvacations"); //УБРАТЬ ТЕСТЫ ПРИ СБОРКЕ НА ПРОДАКШН
