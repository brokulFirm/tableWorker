import Vue from "vue";
import Vuex from "vuex";
import worker from "./worker/worker";
import notice from "./notice/notice";
import workDayInYear from "./workDayInYear/workDayInYear";

Vue.use(Vuex);
Vue.config.devtools = true;
export default new Vuex.Store({
  state: {
    shift: ""
  },
  mutations: {
    changeShift(state, payload) {
      state.shift = payload;
    }
  },
  actions: {
    setShift({ commit }, payload) {
      commit("changeShift", payload);
    }
  },
  modules: {
    worker,
    workDayInYear,
    notice
  },
  getters: {
    getState(state) {
      return state;
    }
  }
});
