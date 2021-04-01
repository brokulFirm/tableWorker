<template>
  <div class="main">
    <v-card class="ma-2 pa-5" elevation="2" width="400">
      <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="computedDateFormattedMomentjs"
            clearable
            label="Wybierz dzień planowania"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            @click:clear="date = null"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          locale="pl-PL"
          :min="dateNow"
          color="green lighten-1"
          @change="menu1 = false"
        ></v-date-picker>
      </v-menu>
      <v-row>
        <v-col>
          <v-btn elevation="2" color="success">W pracę</v-btn>
        </v-col>
        <v-col>Drukuj</v-col>
        <v-col>
          <v-btn elevation="2" color="success">Wolne</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "PlanningWorker",
  props: ["workers", "dateNow"],
  data: () => ({
    date: "",
    menu1: false,
    planned: [],
  }),
  mounted() {
    this.getOutput();
  },
  watch: {
    getVacation() {
      //ТУТ НЕ СРАБАТЫВАЕТ!
      console.log("111");
      this.getOutput();
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    getVacation() {
      return this.getVacState;
    },
    computedDateFormattedMomentjs() {
      moment.locale("pl");
      return this.date ? moment(this.date).format("dddd, D MMMM  YYYY") : "";
    },
  },
  methods: {
    getOutput() {
      let newVacArr = this.getVacation.vacNow.concat(
        this.getVacation.vacPlanned
      );
      console.log("test", this.getVacation.vacNow, newVacArr);
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  display: none;
}
</style>
