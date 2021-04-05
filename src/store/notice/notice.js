require("dotenv").config();

const hostName = process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_PORT;

import axios from "axios";

export default {
  state: {
    submitStatus: "",
    todos: []
  },
  mutations: {
    showTodoList(state, payload) {
      state.todos = payload;
    },
    setSubmitStatus(state, payload) {
      state.submitStatus = payload;
      setTimeout(() => {
        state.submitStatus = "";
      }, 1000);
    }
  },
  actions: {
    async getTodoList({ commit }) {
      await axios.get(`${hostName}/api/notice`).then(res => {
        commit("showTodoList", res.data);
      });
    },
    async removeTodo({ commit }, payload) {
      let response;
      await axios
        .delete(`${hostName}/api/notice/${payload._id}`)
        .then(res => {
          if (res.status == 201) {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("setSubmitStatus", response);
    },
    async addTodo({ commit }, payload) {
      let response;
      await axios
        .post(`${hostName}/api/notice`, payload)
        .then(res => {
          if (res.status == 201) {
            response = "Success";
          }
        })
        .catch(err => {
          console.log(err);
          response = "Error";
        });
      commit("setSubmitStatus", response);
    }
  }
};
