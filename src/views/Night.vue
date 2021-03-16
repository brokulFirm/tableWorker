<template>
  <div class="night">
    <HeaderTable />
    <Table :Workers="getShift" :shift="getState.shift" />
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
    this.getWorkers();
    this.setShift("Night");
  },
  methods: {
    ...mapActions(["getWorkers", "setShift"]),
  },
  computed: {
    ...mapGetters(["getState"]),
    getShift() {
      let workers = this.getState.worker.workers.filter((i) => {
        return i.shift == "Noc";
      });
      return workers;
    },
  },
};
</script>
