require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_PORT;

import axios from "axios";

export default {
  state: {
    submitStatus: "",
    allVacation: [],
    vacNow: [],
    vacPlanned: [],
    sickLeave: [],
    holidays: [],
    dayOff: [],
    notPlanned: [],
    workerVacCount: ""
  },
  mutations: {
    setCountVac(state, payload) {
      state.workerVacCount = "";
      state.workerVacCount = payload;
    },
    setSubmitStatus(state, payload) {
      state.submitStatus = payload;
      setTimeout(() => {
        state.submitStatus = "";
      }, 1000);
    },
    sortForType(state, payload) {
      state.vacNow = [];
      state.vacPlanned = [];
      state.sickLeave = [];
      state.holidays = [];
      state.dayOff = [];
      for (let elem of state.allVacation) {
        if (elem.sickLeave.length) {
          sortVac(state, payload, elem, "sickLeave");
        }
        if (elem.dayOff.length) {
          sortVac(state, payload, elem, "dayOff");
        }
        if (elem.holidays.length) {
          sortVac(state, payload, elem, "holidays");
        }
        if (elem.notPlanned.length) {
          sortVac(state, payload, elem, "notPlanned");
        }
      }
    },
    showVacation(state, payload) {
      let vacSort;
      if (payload.shift === "Night") {
        vacSort = payload.data.filter(i => {
          return i.shift === "Noc";
        });
      } else if (payload.shift === "Day") {
        vacSort = payload.data.filter(i => {
          return i.shift === "Dzień";
        });
      } else {
        vacSort = payload.data;
      }
      state.allVacation = vacSort;
    }
  },
  actions: {
    async getVacations({ commit, rootState }, payload) {
      await axios.get(`${hostName}/api/vacation`).then(res => {
        commit("showVacation", {
          shift: rootState.shift,
          data: res.data
        });
        if (!payload) {
          commit("sortForType", rootState.selectedDate);
        }
      });
    },
    async addVacation({ commit, state }, payload) {
      let response;
      await axios
        .put(`${hostName}/api/vacation`, payload)
        .then(res => {
          if (res.status == "200" || res.status == "201") {
            response = "Success";
          } else {
            response = "Error";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      state.dayOff = [];
      state.holidays = [];
      state.sickLeave = [];
      state.notPlanned = [];
      state.vacPlanned = [];
      state.vacNow = [];
      commit("setSubmitStatus", response);
    }
  },
  getters: {
    getVacState(state) {
      return state;
    }
  }
};

const sortVac = (state, date, elem, vacTitle) => {
  elem[vacTitle].forEach(i => {
    let start = new Date(i.start);
    let end = new Date(i.end);
    let now = new Date(date);
    let worker = {
      _id: elem._id,
      name: elem.name,
      lastName: elem.lastName,
      start: i.start,
      end: i.end,
      type: vacTitle
    };
    if (start <= now && end >= now) {
      state[vacTitle].push(worker);
      state.vacNow.push(worker);
    }
    if (+start == +now && !i.end) {
      state[vacTitle].push(worker);
      state.vacNow.push(worker);
    }
    if (start > now) {
      state.vacPlanned.push(worker);
    }
  });
};
