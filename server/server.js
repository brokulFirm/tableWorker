const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const history = require("connect-history-api-fallback");
require("dotenv").config();
//!!!!Подключаться к API из приложения !!!!

const app = express();
const ip = process.env.VUE_APP_HOST;
app.set("port", 4040);
//Подключаем базу данных перед запуском сервера
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db => console.log("[OK] DB is connected"))
  .catch(err => console.error(err));
//Подключаем  распознование  формата JSON
app.use(express.json());

//Подключаем  расшифровщик URL адресса
app.use(express.urlencoded({ extended: false }));

//Подключаем  логи
app.use(morgan("dev"));

//Подключаем Rest API
app.use("/api/workers", require("./routes/worker"));
app.use("/api/workday", require("./routes/workDay"));
app.use("/api/workdaydinyear", require("./routes/workDayInYear"));
app.use("/api/notice", require("./routes/notice"));
app.use(history());

// Обозначаем статическую папку для  запуска приложения
app.use("/", express.static(path.join(__dirname, "../dist")));

//Запускаем сервер
app.listen(app.get("port"), () => {
  console.log(`[OK] Server is running on ${ip}:${app.get("port")}`);
});
