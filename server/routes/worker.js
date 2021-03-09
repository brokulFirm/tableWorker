const express = require("express");
const routerWorker = express.Router();

const Worker = require("../models/Worker");

//Настраиваем end point для Rest API
routerWorker.get("/", async (req, res) => {
  res.status(200).json(await Worker.find());
});

routerWorker.post("/", async (req, res) => {
  try {
    const record = new Worker(req.body);
    await record.save();
    res.writeHead(201, "OK", { "Content-Type": "text/plain" });
    res.json({ state: "SUCCESS" });
    res.end();
  } catch {
    res.writeHead(404, "Not Found", { "Content-Type": "text/plain" });
    res.json({ state: "ERROR" });
    res.end();
  }
});

routerWorker.put("/:id", async (req, res) => {
  try {
    await Worker.findByIdAndUpdate(req.params.id, req.body);
    res.writeHead(200, "Updated", { "Content-Type": "text/plain" });
    res.json({ state: "SUCCESS" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.json({ state: "ERROR" });
    res.end();
  }
});
module.exports = routerWorker;
