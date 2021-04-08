const express = require("express");
const routerVacation = express.Router();
var moment = require("moment");

const Vacation = require("../models/Vacation");

//Настраиваем end point для Rest API
routerVacation.get("/", async (req, res) => {
  res.status(200).json(await Vacation.find());
});
routerVacation.delete("/:id", async (req, res) => {
  try {
    await Vacation.findByIdAndRemove(req.params.id, req.body, function(
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

routerVacation.put("/", async (req, res) => {
  let newVac = vacationSort(req.body);
  let isCreated = await Vacation.findById(req.body._id);
  try {
    if (isCreated) {
      if (isCreated.year == req.body.year) {
        await Vacation.findByIdAndUpdate(req.body._id, newVac);
      } else {
        let newYear = {
          dayOff: [],
          sickLeave: [],
          notPlanned: [],
          holidays: []
        };
        await Vacation.findByIdAndUpdate(req.body._id, newYear);
        await Vacation.findByIdAndUpdate(req.body._id, newVac);
        console.log("UPDATED");
      }
    } else {
      const record = new Vacation({ _id: req.body._id });
      await record.save();
      await Vacation.findByIdAndUpdate(req.body._id, newVac);
      console.log("CREATED");
    }
    res.writeHead(200, "Updated", { "Content-Type": "text/plain" });
    res.end();
  } catch (err) {
    console.log(err);
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
});

//Генератор объекта для отпусков и выходных

const vacationSort = elem => {
  let vacationType;
  if (elem.type === "Urlop") {
    let start = moment(elem.start);
    var end = moment(elem.end);
    let result;
    if (!elem.end) {
      result = 1;
    } else {
      result = end.diff(start, "days") + 1;
    }

    vacationType = {
      holidays: {
        start: elem.start,
        end: elem.end,
        countDay: result
      }
    };
  } else if (elem.type === "Wolny") {
    vacationType = {
      dayOff: {
        start: elem.start,
        end: elem.end
      }
    };
  } else if (elem.type === "Chorobowy") {
    vacationType = {
      sickLeave: {
        start: elem.start,
        end: elem.end
      }
    };
  } else if (elem.type === "NZ") {
    vacationType = {
      notPlanned: {
        start: elem.start,
        comment: elem.commentNZ
      }
    };
  }

  let vacObj = {
    name: elem.name,
    lastName: elem.lastName,
    year: elem.year,
    vacDay: elem.vacDay,
    shift: elem.shift,
    $push: vacationType
  };
  return vacObj;
};

// Для чистки БД(удаляет все сразу)
// Vacation.deleteMany({}, function(err, result) {
//   if (err) return console.log("ERROR", err);

//   console.log("SUCCESS", result);
// });

module.exports = routerVacation;
