const express = require("express");
const routerWorkDayInYear = express.Router();

const WorkDayInYear = require("../models/WorkDayInYear");

//Настраиваем end point для Rest API
routerWorkDayInYear.get("/", async (req, res) => {
  res.status(200).json(await WorkDayInYear.find());
});

routerWorkDayInYear.post("/", async (req, res) => {
  try {
    const record = new WorkDayInYear(req.body);
    await record.save();
    res.writeHead(201, "OK", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "Not Found", { "Content-Type": "text/plain" });
    res.end();
  }
});

routerWorkDayInYear.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    await WorkDayInYear.findByIdAndUpdate(req.params.id, req.body);
    res.writeHead(200, "Updated", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
});
module.exports = routerWorkDayInYear;
