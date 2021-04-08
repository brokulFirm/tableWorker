<template>
  <div class="main ma-2">
    <div class="workerInfo">
      <h4>Adres zamieszkania:</h4>
      <span>{{ worker.adres || "Brak" }}</span>
    </div>
    <div class="workerInfo">
      <h4>Rodzaj umowy:</h4>
      <span>{{ worker.contract || "Brak" }}</span>
    </div>
    <div class="workerInfo">
      <h4>Dni urlopu:</h4>
      <span>{{ worker.vacDay || "Brak" }}</span>
      <h4 class="ml-2">Zost.:</h4>
      <span>{{ vacLeft || "Brak" }}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "WorkerInfo",
  props: ["worker"],
  data: () => ({
    cotractType: ["Zlecenie", "Działalność"],
    vacLeft: "",
  }),
  created() {
    this.chekVacLeft();
  },
  watch: {
    worker() {
      this.chekVacLeft();
    },
    getHolidays() {
      this.chekVacLeft();
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    getHolidays() {
      let workerVac = this.getVacState.allVacation.find(
        (i) => i._id == this.worker._id
      );
      let vacCount = 0;
      if (workerVac) {
        for (let vacDay of workerVac.holidays) {
          vacCount += Number(vacDay.countDay);
        }
      }
      return vacCount;
    },
  },
  methods: {
    ...mapMutations(["setCountVac"]),
    chekVacLeft() {
      this.vacLeft = this.worker.vacDay - this.getHolidays;
      if (this.vacLeft === 0) {
        this.vacLeft = "0";
      }
      this.setCountVac(this.vacLeft);
    },
  },
};
</script>
<style lang="scss" scoped>
.workerInfo {
  display: flex;
  padding: 5px;
  span {
    margin-left: 5px;
  }
}
</style>
