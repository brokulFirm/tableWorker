import Vue from "vue";
import VueRouter from "vue-router";
import Start from "../views/Start.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Start",
    component: Start
  },
  {
    path: "/12pkdzien23fa71br",
    name: "Day",
    component: () => import(/* webpackChunkName: "day" */ "../views/Day.vue")
  },
  {
    path: "/25pknoc18qm34zj",
    name: "Night",
    component: () =>
      import(/* webpackChunkName: "night" */ "../views/Night.vue")
  },
  {
    path: "/72pkwynik2pz51vy296",
    name: "AllShifts",
    component: () =>
      import(/* webpackChunkName: "night" */ "../views/AllShifts.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
