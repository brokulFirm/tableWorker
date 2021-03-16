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
    path: "/night",
    name: "Night",
    component: () =>
      import(/* webpackChunkName: "night" */ "../views/Night.vue")
  },
  {
    path: "/allshift",
    name: "AllShifts",
    component: () =>
      import(/* webpackChunkName: "night" */ "../views/AllShifts.vue")
  },
  {
    path: "/day",
    name: "Day",
    component: () => import(/* webpackChunkName: "day" */ "../views/Day.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
