require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_PORT;

import axios from "axios";

export default {
  state: {
    workers: []
  },
  mutations: {
    showWorkersInYear(state, payload) {
      state.workers = payload;
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
    async removeWorkerInYear({ commit }, payload) {
      commit("deleteWorkerInYear", payload);
      await axios.delete(`${hostName}/api/workdaydinyear/${payload._id}`);
    }
  }
};
