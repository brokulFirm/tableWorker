<template>
  <div class="day">
    <HeaderTable />
    <Table
      :Workers="getShift"
      :shift="getState.shift"
      :submitStatus="getState.worker.submitStatus"
      :todos="getTodos"
      :vacation="getState.vacation.vacNow"
    />
  </div>
</template>

<script>
import HeaderTable from "../components/HeaderTable";
import Table from "../components/Table";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Day",
  components: {
    HeaderTable,
    Table,
  },
  created() {
    this.getTodoList();
    this.getWorkers();
    this.setShift("Day");
  },
  methods: {
    ...mapActions(["getWorkers", "setShift", "getTodoList"]),
  },
  computed: {
    ...mapGetters(["getState"]),
    getShift() {
      let workers = this.getState.worker.workers.filter((i) => {
        return i.shift == "Dzień";
      });
      return workers;
    },
    getTodos() {
      let todoList = this.getState.notice.todos.filter((i) => {
        return i.shift == "Day";
      });
      return todoList;
    },
  },
};
</script>
