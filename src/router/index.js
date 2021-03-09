import Vue from "vue";
import VueRouter from "vue-router";
import AllShifts from "../views/AllShifts.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "AllShifts",
    component: AllShifts
  },
  {
    path: "/night",
    name: "Night",
    component: () =>
      import(/* webpackChunkName: "night" */ "../views/Night.vue")
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
