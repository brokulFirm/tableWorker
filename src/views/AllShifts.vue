<template>
  <div class="allShifts">
    <HeaderTable />
    <SummaryTable
      :Workers="getShift"
      :holidays="getState.vacation.allVacation"
    />
  </div>
</template>

<script>
import HeaderTable from "../components/HeaderTable";
import SummaryTable from "../components/allshifts/SummaryTable";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "AllShifts",
  components: {
    HeaderTable,
    SummaryTable,
  },
  created() {
    this.getVacations("Wyniki");
    this.getWorkersInYear();
    this.setShift("AllShift");
  },
  methods: {
    ...mapActions(["getWorkersInYear", "setShift", "getVacations"]),
  },
  computed: {
    ...mapGetters(["getState"]),
    getShift() {
      let workers;
      if (this.getState.shift === "Day") {
        workers = this.getState.workDayInYear.workers.filter((i) => {
          return i.shift == "Dzień";
        });
        return workers;
      } else if (this.getState.shift === "Night") {
        workers = this.getState.workDayInYear.workers.filter((i) => {
          return i.shift == "Noc";
        });
        return workers;
      } else if (this.getState.shift === "AllShift") {
        workers = this.getState.workDayInYear.workers;
      }
      return workers;
    },
  },
};
</script>
