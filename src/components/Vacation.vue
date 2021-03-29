<template>
  <div>SDSDSDSDSDSD</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Vacation",
  props: ["dateNow"],
  data: () => ({
    vacations: [],
  }),
  created() {
    this.getVacations();
    this.getActiveVac();
  },
  watch: {
    vacationState() {
      this.vacations = [];
      this.getActiveVac();
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    vacationState() {
      return this.getVacState.allVacation;
    },
  },
  methods: {
    ...mapActions(["getVacations"]),
    getActiveVac() {
      for (let elem of this.getVacState.allVacation) {
        if (elem.sickLeave.length) {
          elem.sickLeave.forEach((i) => {
            let start = new Date(i.start);
            let end = new Date(i.end);
            let now = new Date(this.dateNow);
            if (start >= now || end >= now) {
              this.vacations.push(elem);
            }
          });
        } else if (elem.dayOff.length) {
          elem.dayOff.forEach((i) => {
            let start = new Date(i.start);
            let end = new Date(i.end);
            let now = new Date(this.dateNow);
            if (start >= now || end >= now) {
              this.vacations.push(elem);
            }
          });
        } else if (elem.holidays.length) {
          elem.holidays.forEach((i) => {
            let start = new Date(i.start);
            let end = new Date(i.end);
            let now = new Date(this.dateNow);
            if (start >= now || end >= now) {
              this.vacations.push(elem);
            }
          });
        }
      }
    },
  },
};
</script>
