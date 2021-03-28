const express = require("express");
const routerVacation = express.Router();

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
      console.log("UPDATED", newVac);
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
      }
    } else {
      console.log("CREATED", newVac);
      const record = new Vacation({ _id: req.body._id });
      await record.save();
      await Vacation.findByIdAndUpdate(req.body._id, newVac);
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
    let startDay = elem.start.split("-")[2];
    let endDay = elem.end.split("-")[2];
    if (startDay.split("")[0] == "0") {
      startDay = startDay.split("")[1];
    }
    if (endDay.split("")[0] == "0") {
      endDay = endDay.split("")[1];
    }
    vacationType = {
      holidays: {
        start: elem.start,
        end: elem.end,
        countDay: Number(endDay) - Number(startDay)
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
      notPlanned: elem.start
    };
  }

  let vacObj = {
    name: elem.name,
    lastName: elem.lastName,
    year: elem.year,
    vacDay: elem.vacDay,
    $push: vacationType
  };
  //   console.log(vacObj);
  return vacObj;
};

module.exports = routerVacation;
