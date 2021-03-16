// import axios from "axios";
const hostName = "http://192.168.1.35:5050";

import axios from "axios";

export default {
  state: {
    workers: [
      // {
      //   _id: "1",
      //   name: "Viktar",
      //   lastName: "Keura",
      //   startDate: "2020-06",
      //   rate: 230,
      //   shift: "Noc",
      //   number: "668377499",
      //   medicalBoard: "2022-06-15"
      // },
      // {
      //   _id: "2",
      //   name: "Paulina",
      //   lastName: "Zielke",
      //   startDate: "2020-03",
      //   rate: 250,
      //   shift: "Noc",
      //   number: "123565484",
      //   medicalBoard: "2023-02-11"
      // },
      // {
      //   _id: "3",
      //   name: "Piotr",
      //   lastName: "Goralski",
      //   startDate: "2020-02",
      //   rate: 250,
      //   shift: "Noc",
      //   number: "635842695",
      //   medicalBoard: "2022-09-25"
      // },
      // {
      //   _id: "4",
      //   name: "Andriej",
      //   lastName: "Olijnik",
      //   startDate: "2020-08",
      //   rate: 220,
      //   shift: "Noc",
      //   number: "124582365",
      //   medicalBoard: "2021-12-05"
      // }
    ]
  },
  mutations: {
    showWorkers(state, payload) {
      state.workers = payload;
    },
    createWorker(state, payload) {
      state.workers.push(payload);
    },
    deleteWorker(state, payload) {
      state.workers = state.workers.filter(i => {
        return i._id != payload._id;
      });
    },
    changeWorkerInfo(state, payload) {
      state.workers = state.workers.map(i => {
        if (i._id == payload._id) i = { ...payload };
        return i;
      });
    }
  },
  actions: {
    async getWorkers({ commit }) {
      await axios.get(`${hostName}/api/workers`).then(res => {
        commit("showWorkers", res.data);
      });
    },
    async addNewWorker({ commit }, payload) {
      commit("createWorker", payload);
      await axios.post(`${hostName}/api/workers`, payload);
    },
    async removeWorker({ commit }, payload) {
      commit("deleteWorker", payload);
      await axios.delete(`${hostName}/api/workers/${payload._id}`);
    },
    async setWorker({ commit }, payload) {
      commit("changeWorkerInfo", payload);
      await axios.put(`${hostName}/api/workers/${payload._id}`, payload);
    },
    async addCountDay(context, payload) {
      console.log(context);
      await axios.put(`${hostName}/api/workday/`, payload);
    }
  }
};
