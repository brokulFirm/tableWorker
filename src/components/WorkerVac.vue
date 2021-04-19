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
          :allowed-dates="permittedDates"
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
          :allowed-dates="permittedDates"
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
        <v-icon class="mx-3" large v-else-if="status == 'Error'" color="red">
          mdi-minus-circle
        </v-icon>
        <div v-else-if="status == 'HolidayError'" class="holidayError">
          Maksymalna liczba dni {{ this.getCountVacDay }}
        </div>
        <div v-else-if="status == 'HolidayMonth'" class="holidayError">
          Wybierz urlop w jednym miesiącu
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import "twix";
export default {
  name: "WorkerVac",
  props: ["worker", "dateNow", "getSelected", "outputId"],
  data: () => ({
    dateStart: "",
    dateEnd: "",
    menu1: false,
    menu2: false,
    vacationType: ["Urlop", "Chorobowy", "Wolny", "NZ"],
    vacationActive: "",
    status: "",
    commentNZ: "",
    allowedDates: [],
  }),
  beforeUpdate() {
    this.getBusyDate();
  },
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
    getCountVacDay() {
      if (this.getCountVacDay == 0 || !this.worker.vacDay) {
        this.vacationType = ["Chorobowy", "Wolny", "NZ"];
      } else {
        this.vacationType = ["Urlop", "Chorobowy", "Wolny", "NZ"];
      }
      this.getBusyDate();
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    getCountVacDay() {
      return this.getVacState.workerVacCount;
    },
  },
  methods: {
    ...mapActions(["addVacation", "getVacations"]),
    async addNewVacation() {
      //Добавление отпуска, выходного, больничного работнику с определением даты и типа выходного
      let start = moment(this.dateStart);
      var end = moment(this.dateEnd);
      let result;
      if (!this.dateEnd) {
        result = 1;
      } else {
        result = end.diff(start, "days") + 1;
      }
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
      if (this.vacationActive === "Urlop") {
        if (result > this.getCountVacDay) {
          this.status = "HolidayError";
        } else if (
          this.vacationActive === "Urlop" &&
          this.dateEnd &&
          this.dateEnd.split("-")[1] != this.dateStart.split("-")[1]
        ) {
          this.status = "HolidayMonth";
        } else {
          await this.addVacation(vacObj);
        }
      } else if (!this.vacationActive || !this.dateStart) {
        this.status = "Error";
      } else {
        await this.addVacation(vacObj);
      }
      if (this.dateStart == this.dateNow) {
        //Передаем ИД для удаления из таблицы если день выходного совпадает с настоящей датой
        this.getSelected(this.worker._id, "RemoveSelected");
        this.outputId.push(this.worker._id);
      }
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
    permittedDates(val) {
      if (this.allowedDates.indexOf(val) !== -1) {
        return false;
      } else {
        return true;
      }
    },
    getBusyDate() {
      //Собирает все даты выходных для ограничения в календаре
      let worker = this.getVacState.allVacation.find(
        (i) => i._id == this.worker._id
      );
      this.allowedDates = [];
      if (worker && worker.holidays.length) {
        worker.holidays.forEach((i) => {
          if (i.start >= this.dateNow) this.pushDate(i);
        });
      }
      if (worker && worker.sickLeave.length) {
        worker.sickLeave.forEach((i) => {
          if (i.start >= this.dateNow) this.pushDate(i);
        });
      }
      if (worker && worker.dayOff.length) {
        worker.dayOff.forEach((i) => {
          if (i.start >= this.dateNow) this.pushDate(i);
        });
      }
    },
    pushDate(elem) {
      //Определяет разницу в датах и заполянет массив с занятыми датами
      let end = elem.end;
      if (!elem.end) {
        end = elem.start;
      }
      let itr = moment
        .twix(new Date(elem.start), new Date(end))
        .iterate("days");
      while (itr.hasNext()) {
        this.allowedDates.push(itr.next().format("YYYY-MM-DD"));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.selected {
  max-width: 250px;
}
.holidayError {
  color: red;
  font-weight: 400;
}
</style>
