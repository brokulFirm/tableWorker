const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const history = require("connect-history-api-fallback");

//!!!!Подключаться к API из приложения !!!!

const app = express();
const ip = "http://192.168.1.35";
app.set("port", 5050);
//Подключаем базу данных перед запуском сервера
mongoose
  .connect(
    "mongodb://brokul_firm:SBAMUvPZN9iu3Fb9@cluster0-shard-00-00.cv9nv.mongodb.net:27017,cluster0-shard-00-01.cv9nv.mongodb.net:27017,cluster0-shard-00-02.cv9nv.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-a9kw9v-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
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
app.use(history());

// Обозначаем статическую папку для  запуска приложения
app.use("/", express.static(path.join(__dirname, "../dist")));

//Запускаем сервер
app.listen(app.get("port"), () => {
  console.log(`[OK] Server is running on ${ip}:${app.get("port")}`);
});
