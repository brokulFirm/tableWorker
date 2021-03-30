import Vue from "vue";
import Vuex from "vuex";
import worker from "./worker/worker";
import notice from "./notice/notice";
import vacation from "./vacation/vacation";
import workDayInYear from "./workDayInYear/workDayInYear";

Vue.use(Vuex);
Vue.config.devtools = true;
export default new Vuex.Store({
  state: {
    shift: "",
    selectedDate: ""
  },
  mutations: {
    changeShift(state, payload) {
      state.shift = payload;
    },
    changeDate(state, payload) {
      state.selectedDate = payload;
    }
  },
  actions: {
    setShift({ commit }, payload) {
      commit("changeShift", payload);
    },
    setSelectedDate({ commit }, payload) {
      commit("changeDate", payload);
    }
  },
  modules: {
    worker,
    workDayInYear,
    notice,
    vacation
  },
  getters: {
    getState(state) {
      return state;
    }
  }
});
