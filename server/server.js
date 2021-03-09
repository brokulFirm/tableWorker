const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
// const path = require("path");

//!!!!Подключаться к API из приложения !!!!

const app = express();

app.set("port", 5000);
//Подключаем базу данных перед запуском сервера
mongoose
  .connect(
    "mongodb+srv://brokul_firm:SBAMUvPZN9iu3Fb9@cluster0.cv9nv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

//Обозначаем статическую папку для  запуска приложения
// app.use("/", express.static(path.join(__dirname, "../dist")));

//Запускаем сервер
app.listen(app.get("port"), () => {
  console.log(`[OK] Server is running on localhost:${app.get("port")}`);
});
