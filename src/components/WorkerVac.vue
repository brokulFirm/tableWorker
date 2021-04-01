<template>
  <div class="d-flex">
    <div>
      <h5>Wybierz date urlopu dla {{ worker.name + " " + worker.lastName }}</h5>
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateStart"
            label="Wybierz datę rozpoczęcia"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateStart"
          :first-day-of-week="1"
          locale="pl-PL"
          :min="dateNow"
          @input="menu1 = false"
        ></v-date-picker>
      </v-menu>
      <v-menu
        v-if="vacationActive != 'NZ'"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateEnd"
            label="Wybierz datę zakończenia"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dateEnd"
          :first-day-of-week="1"
          locale="pl-PL"
          :min="dateNow"
          @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
      <v-textarea
        v-else
        label="Wpisz komentarz"
        auto-grow
        outlined
        v-model="commentNZ"
        rows="1"
        row-height="15"
      ></v-textarea>
    </div>
    <div
      class="selected mx-5 align-self-center d-flex flex-column align-center"
    >
      <v-select
        :items="vacationType"
        label="Wybierz rodzaj wolnego"
        outlined
        dense
        v-model="vacationActive"
      ></v-select>
      <div class="d-flex flex-row justify-space-around">
        <v-btn elevation="2" @click="addNewVacation" dark color="indigo">
          Dodaj
        </v-btn>
        <v-icon
          class="mx-3"
          large
          v-if="status == 'Success'"
          color="green darken-2"
        >
          mdi-check-all
        </v-icon>
        <v-icon class="mx-3" large v-if="status == 'Error'" color="red">
          mdi-minus-circle
        </v-icon>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "WorkerVac",
  props: ["worker", "dateNow"],
  data: () => ({
    dateStart: "",
    dateEnd: "",
    menu1: false,
    menu2: false,
    vacationType: ["Urlop", "Chorobowy", "Wolny", "NZ"],
    vacationActive: "",
    status: "",
    commentNZ: "",
  }),
  watch: {
    status() {
      if (this.status) {
        setTimeout(() => {
          this.status = "";
        }, 4000);
      }
    },
    worker() {
      this.dateStart = "";
      this.dateEnd = "";
      this.vacationActive = "";
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
  },
  methods: {
    ...mapActions(["addVacation", "getVacations"]),
    async addNewVacation() {
      let vacObj = {
        _id: this.worker._id,
        type: this.vacationActive,
        start: this.dateStart,
        end: this.dateEnd,
        name: this.worker.name,
        lastName: this.worker.lastName,
        shift: this.worker.shift,
        vacDay: this.worker.vacDay,
        year: this.dateNow.split("-")[0],
        commentNZ: this.commentNZ,
      };
      await this.addVacation(vacObj);
      this.getVacations();
      if (this.getVacState.submitStatus == "Success") {
        this.status = "Success";
      } else if (this.getVacState.submitStatus == "Error") {
        this.status = "Error";
      }
      this.dateStart = "";
      this.dateEnd = "";
      this.vacationActive = "";
      this.commentNZ = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.selected {
  max-width: 250px;
}
</style>
