<template>
  <div class="night">
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
  name: "Night",
  components: {
    HeaderTable,
    Table,
  },
  created() {
    this.getTodoList();
    this.getWorkers();
    this.setShift("Night");
  },
  methods: {
    ...mapActions(["getWorkers", "setShift", "getTodoList"]),
  },
  computed: {
    ...mapGetters(["getState"]),
    getShift() {
      let workers = this.getState.worker.workers.filter((i) => {
        return i.shift == "Noc";
      });
      return workers;
    },
    getTodos() {
      let todoList = this.getState.notice.todos.filter((i) => {
        return i.shift == "Night";
      });
      return todoList;
    },
  },
};
</script>
