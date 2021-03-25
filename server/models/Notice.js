const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notice = new Schema({
  description: String,
  date: String,
  shift: String
});
module.exports = mongoose.model("Notice", Notice, "testnotices"); //УБРАТЬ ТЕСТЫ ПРИ СБОРКЕ НА ПРОДАКШН
