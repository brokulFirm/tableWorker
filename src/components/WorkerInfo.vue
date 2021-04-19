<template>
  <div class="main d-flex">
    <div class="ma-2">
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
    <div class="mx-2">
      <div class="workerInfo flex-wrap">
        <h4>Wolne:</h4>
        <v-chip
          class="vacDate"
          v-for="item in dayOff"
          :key="item.start"
          close
          color="blue"
          close-icon="mdi-clipboard-edit-outline"
          label
          outlined
          @click:close="setVacType(item)"
        >
          {{ item.end ? item.start + " --- " + item.end : item.start }}
        </v-chip>
        <v-dialog v-model="dialog" max-width="600">
          <v-card>
            <v-card-title class="headline">
              Napewno chcesz zmienić wolny na urlop w dniach {{ dialogText }}???
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="dialog = false">
                Zamkni
              </v-btn>

              <v-btn color="green darken-1" text @click="confirmSetVacType()">
                Akceptuj
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div class="workerInfo flex-wrap">
        <h4>Urlopy:</h4>
        <v-chip
          class="vacDate"
          v-for="item in holidays"
          :key="item.start"
          color="blue"
          label
          outlined
        >
          {{ item.end ? item.start + " --- " + item.end : item.start }}
        </v-chip>
      </div>
      <div class="workerInfo flex-wrap">
        <h4>Chorobowe:</h4>
        <v-chip
          class="vacDate"
          v-for="item in sickLeave"
          :key="item.start"
          color="blue"
          label
          outlined
        >
          {{ item.end ? item.start + " --- " + item.end : item.start }}
        </v-chip>
      </div>
      <div class="workerInfo flex-wrap">
        <h4>Nie zaplanowane:</h4>
        <v-chip
          class="vacDate"
          v-for="item in notPlanned"
          :key="item.start"
          color="blue"
          label
          outlined
        >
          {{ item.comment ? item.start + " --- " + item.comment : item.start }}
        </v-chip>
      </div>
    </div>
    <div class="text-center">
      <v-snackbar v-model="snackbar" :multi-line="multiLine">
        Nie możesz dodać więcej urlopu niż pozostało!!!!
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
export default {
  name: "WorkerInfo",
  props: ["worker", "dateNow"],
  data: () => ({
    cotractType: ["Zlecenie", "Działalność"],
    dialog: false,
    snackbar: false,
    dialogText: "",
    editVac: {
      start: "",
      end: "",
    },
    vacLeft: "",
    holidays: [],
    dayOff: [],
    sickLeave: [],
    notPlanned: [],
  }),
  created() {
    this.chekVacLeft();
    this.showVacationsType();
  },
  watch: {
    dialog() {
      if (this.dialog === false) {
        this.dialogText = "";
        this.editVac.start = "";
        this.editVac.end = "";
      }
    },
    worker() {
      this.chekVacLeft();
      this.showVacationsType();
    },
    getHolidays() {
      this.chekVacLeft();
    },
    getWorkerVacations() {
      this.showVacationsType();
      this.chekVacLeft();
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    getHolidays() {
      //Определяем количество  отпускных дней у работника
      let workerVac = this.getVacState.allVacation.find(
        (i) => i._id == this.worker._id
      );
      let date = new Date(this.dateNow);
      let vacCount = 0;
      if (workerVac) {
        for (let vacDay of workerVac.holidays) {
          let dateItem = new Date(vacDay.start);
          if (dateItem.getFullYear() == date.getFullYear()) {
            vacCount += Number(vacDay.countDay);
          }
        }
      }
      return vacCount;
    },
    getWorkerVacations() {
      let workerVac = this.getVacState.allVacation.find(
        (i) => i._id == this.worker._id
      );
      return workerVac;
    },
  },
  methods: {
    ...mapMutations(["setCountVac"]),
    ...mapActions(["removeVacation", "getVacations"]),
    chekVacLeft() {
      //Определяем количество оставшихся отпускных дней у работника
      this.vacLeft = this.worker.vacDay - this.getHolidays;
      if (this.vacLeft === 0) {
        this.vacLeft = "0";
      }
      this.setCountVac(this.vacLeft);
    },
    filterMonthDate(elem) {
      //Проверяем на совпадение по определенному месяцу
      let date = new Date(this.dateNow);
      return elem.filter((i) => {
        let itemDate = new Date(i.start);
        return itemDate.getMonth() == date.getMonth();
      });
    },
    showVacationsType() {
      this.dayOff = this.filterMonthDate(this.getWorkerVacations.dayOff);
      this.holidays = this.filterMonthDate(this.getWorkerVacations.holidays);
      this.sickLeave = this.filterMonthDate(this.getWorkerVacations.sickLeave);
      this.notPlanned = this.filterMonthDate(
        this.getWorkerVacations.notPlanned
      );
    },
    setVacType(elem) {
      //Генерируем текст для всплывающего окна при изменении выходного в отпуск
      this.dialogText = elem.end ? elem.start + " --- " + elem.end : elem.start;
      this.dialog = true;
      this.editVac.start = elem.start;
      this.editVac.end = elem.end;
    },
    async confirmSetVacType() {
      //Отправляем объект с датами для изменения выходного в отпуск
      let start = moment(this.editVac.start);
      let end = moment(this.editVac.end);
      let result;
      if (!this.editVac.end) {
        result = 1;
      } else {
        result = end.diff(start, "days") + 1;
      }
      let vacObj = {
        _id: this.worker._id,
        start: this.editVac.start,
        end: this.editVac.end,
        title: "ChangeVac",
      };
      console.log(result);
      if (result <= this.vacLeft) await this.removeVacation(vacObj);
      else {
        this.snackbar = true;
      }
      this.getVacations();
      this.dialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.workerInfo {
  display: flex;
  padding: 5px;
  align-items: center;
  span {
    margin-left: 5px;
  }
}
.vacDate {
  margin: 2px;
}
</style>
