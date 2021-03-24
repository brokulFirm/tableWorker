require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":4040";

import axios from "axios";

export default {
  state: {
    workers: [],
    submitStatus: ""
  },
  mutations: {
    showWorkers(state, payload) {
      state.workers = payload;
    },
    deleteWorker(state, payload) {
      state.workers = state.workers.filter(i => {
        return i._id != payload._id;
      });
    },
    changeStatus(state, payload) {
      state.submitStatus = payload;
      setTimeout(() => {
        state.submitStatus = "";
      }, 1000);
    }
  },
  actions: {
    async getWorkers({ commit }) {
      await axios.get(`${hostName}/api/workers`).then(res => {
        commit("showWorkers", res.data);
      });
    },
    async addNewWorker({ commit }, payload) {
      let response;
      await axios
        .post(`${hostName}/api/workers`, payload)
        .then(res => {
          if (res.status == 201) {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("changeStatus", response);
    },
    async removeWorker({ commit }, payload) {
      commit("deleteWorker", payload);
      await axios.delete(`${hostName}/api/workers/${payload._id}`);
    },
    async setWorker({ commit }, payload) {
      let response;
      await axios
        .put(`${hostName}/api/workers/${payload._id}`, payload)
        .then(res => {
          if (res.status == 200) {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("changeStatus", response);
    },
    async addCountDay({ commit }, payload) {
      let response;
      await axios
        .put(`${hostName}/api/workday/`, payload)
        .then(res => {
          if (res.status == 200) {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("changeStatus", response);
    }
  }
};
