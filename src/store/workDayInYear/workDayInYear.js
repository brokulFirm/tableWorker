require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_PORT;

import axios from "axios";

export default {
  state: {
    workers: [],
    workerDays: {}
  },
  mutations: {
    showWorkersInYear(state, payload) {
      state.workers = payload;
    },
    showWorkerDays(state, payload) {
      state.workerDays = payload;
    },

    deleteWorkerInYear(state, payload) {
      state.workers = state.workers.filter(i => {
        return i._id != payload._id;
      });
    }
  },
  actions: {
    async getWorkersInYear({ commit }) {
      await axios.get(`${hostName}/api/workdaydinyear`).then(res => {
        commit("showWorkersInYear", res.data);
      });
    },
    async getWorkerDays({ commit }, payload) {
      await axios.get(`${hostName}/api/workdaydinyear/${payload}`).then(res => {
        commit("showWorkerDays", res.data);
      });
    },
    async removeWorkerInYear({ commit }, payload) {
      commit("deleteWorkerInYear", payload);
      await axios.delete(`${hostName}/api/workdaydinyear/${payload._id}`);
      await axios.delete(`${hostName}/api/vacation/${payload._id}`);
    }
  },
  getters: {
    getWorkerDaysState(state) {
      return state;
    }
  }
};
