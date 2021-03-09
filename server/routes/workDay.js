const express = require("express");
const routerWorkDay = express.Router();

const WorkDay = require("../models/WorkDay");

//Настраиваем end point для Rest API
routerWorkDay.get("/", async (req, res) => {
  res.status(200).json(await WorkDay.find());
});

routerWorkDay.post("/", async (req, res) => {
  try {
    const record = new WorkDay(req.body);
    await record.save();
    res.writeHead(201, "OK", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "Not Found", { "Content-Type": "text/plain" });
    res.end();
  }
});

routerWorkDay.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    await WorkDay.findByIdAndUpdate(req.params.id, req.body);
    res.writeHead(200, "Updated", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
});
module.exports = routerWorkDay;
