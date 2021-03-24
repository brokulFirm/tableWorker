const express = require("express");
const routerWorkDay = express.Router();

const WorkDay = require("../models/WorkDay");

const WorkDayInYear = require("../models/WorkDayInYear");

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

//Разобраться с поиском и сравнением елементов в mongoose. Для того что бы добавлять новые елементы, если нету в БД
routerWorkDay.put("/", async (req, res) => {
  // console.log(req.body);
  let countDayInfo = await WorkDay.find();
  let countRes = 0;
  try {
    for (let elem of req.body) {
      let countDayElem = countDayInfo.find(i => i._id == elem._id);
      if (countDayElem) {
        if (
          !countDayElem.countDay.includes(elem.countDay) &&
          countDayElem.month == elem.month
        ) {
          await WorkDay.findByIdAndUpdate(elem._id, {
            _id: elem._id,
            name: elem.name,
            lastName: elem.lastName,
            shift: elem.shift,
            rate: elem.rate,
            month: elem.month,
            $push: { countDay: elem.countDay }
          });
        }
        if (countDayElem.month !== elem.month) {
          await WorkDay.findByIdAndUpdate(elem._id, {
            _id: elem._id,
            name: elem.name,
            lastName: elem.lastName,
            shift: elem.shift,
            rate: elem.rate,
            month: elem.month,
            countDay: elem.countDay
          });
        }
      } else {
        const record = new WorkDay(elem);
        await record.save();
      }
      countRes += 1;
    }
    console.log("Objects received---", countRes);
    res.writeHead(200, "Updated", { "Content-Type": "text/plain" });
    res.end();
  } catch {
    res.writeHead(404, "ERROR", { "Content-Type": "text/plain" });
    res.end();
  }
  setYearInfo();
});
//Проверяем изменения счетчика, и обновляем данные за год
let setYearInfo = async () => {
  let workDayInfo = await WorkDay.find();
  let workDayInYearInfo = await WorkDayInYear.find();
  try {
    for (let i of workDayInfo) {
      let workYear = workDayInYearInfo.find(e => e._id == i._id);

      let yearNow = i.month.split("-")[0];
      let monthNow = i.month.split("-")[1];
      if (workYear) {
        if (workYear.year == yearNow) {
          await WorkDayInYear.updateOne(
            { _id: i._id },
            {
              year: yearNow,
              $set: {
                ["month." + monthNow]: {
                  monthRate: i.rate,
                  countDay: i.countDay
                }
              }
            }
          );
        } else {
          await WorkDayInYear.updateOne(
            { _id: i._id },
            {
              year: yearNow,
              month: {
                [monthNow]: {
                  monthRate: i.rate,
                  countDay: i.countDay
                }
              }
            }
          );
        }
      } else {
        const record = new WorkDayInYear({
          _id: i._id,
          name: i.name,
          lastName: i.lastName,
          shift: i.shift,
          year: yearNow,
          ["month." + monthNow]: {
            monthRate: i.rate,
            countDay: i.countDay
          }
        });
        await record.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// Для чистки БД(удаляет все сразу)
// WorkDay.deleteMany({}, function(err, result) {
//   if (err) return console.log("ERROR", err);

//   console.log("SUCCESS", result);
// });
module.exports = routerWorkDay;
