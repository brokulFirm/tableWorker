const express = require("express");
const routerNotice = express.Router();

const Notice = require("../models/Notice");

//Настраиваем end point для Rest API
routerNotice.get("/", async (req, res) => {
  res.status(200).json(await Notice.find());
});
routerNotice.post("/", async (req, res) => {
  try {
    const record = new Notice(req.body);
    await record.save();
    res.writeHead(201, "OK", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "Not Found", { "Content-Type": "text/plain" });
    res.end();
  }
});
routerNotice.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndRemove(req.params.id, req.body, function(
      err,
      data
    ) {
      if (!err) {
        console.log("Deleted");
      }
    });
    res.writeHead(200, "Deleted", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
});

module.exports = routerNotice;
