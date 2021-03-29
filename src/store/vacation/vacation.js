require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":4040";

import axios from "axios";

export default {
  state: {
    submitStatus: "",
    allVacation: []
  },
  mutations: {
    showVacations(state, payload) {
      state.allVacation = payload;
    },
    setSubmitStatus(state, payload) {
      state.submitStatus = payload;
      setTimeout(() => {
        state.submitStatus = "";
      }, 1000);
    }
  },
  actions: {
    async getVacations({ commit }) {
      await axios.get(`${hostName}/api/vacation`).then(res => {
        commit("showVacations", res.data);
        console.log(res.data);
      });
    },
    async addVacation({ commit }, payload) {
      let response;
      await axios
        .put(`${hostName}/api/vacation`, payload)
        .then(res => {
          if (res.status == "200" || res.status == "201") {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("setSubmitStatus", response);
    }
  },
  getters: {
    getVacState(state) {
      return state;
    }
  }
};
