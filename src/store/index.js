import Vue from "vue";
import Vuex from "vuex";
import worker from "./worker/worker";
import workDay from "./workDay/workDay";
import workDayInYear from "./workDayInYear/workDayInYear";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    worker,
    workDay,
    workDayInYear
  },
  getters: {
    getState(state) {
      return state;
    }
  }
});
