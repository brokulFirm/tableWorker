const express = require("express");
const routerWorkDayInYear = express.Router();

const WorkDayInYear = require("../models/WorkDayInYear");
const WorkDay = require("../models/WorkDay");

//Настраиваем end point для Rest API
routerWorkDayInYear.get("/", async (req, res) => {
  res.status(200).json(await WorkDayInYear.find());
});
routerWorkDayInYear.get("/:id", async (req, res) => {
  res.status(200).json(await WorkDayInYear.findById(req.params.id));
});
routerWorkDayInYear.delete("/:id", async (req, res) => {
  try {
    await WorkDayInYear.findByIdAndRemove(req.params.id, req.body, function(
      err,
      data
    ) {
      if (!err) {
        console.log("Deleted");
      }
    });
    await WorkDay.findByIdAndRemove(req.params.id, req.body);
    res.writeHead(200, "Deleted", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
});
// Для чистки БД(удаляет все сразу)
// WorkDayInYear.deleteMany({}, function(err, result) {
//   if (err) return console.log("ERROR", err);

//   console.log("SUCCESS", result);
// });
module.exports = routerWorkDayInYear;
