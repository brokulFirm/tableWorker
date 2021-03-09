<template>
  <div class="night">
    <HeaderTable />
    <Table :getWorkers="getState.worker.workers" />
  </div>
</template>

<script>
import HeaderTable from "../components/HeaderTable";
import Table from "../components/night/Table";
import { mapGetters } from "vuex";
export default {
  name: "Night",
  components: {
    HeaderTable,
    Table
  },
  computed: {
    ...mapGetters(["getState"])
  }
};
</script>
