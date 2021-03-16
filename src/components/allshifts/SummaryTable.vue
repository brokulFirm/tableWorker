<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="workers"
      :search="search"
      sort-by="name"
      class="elevation-2"
      item-key="name"
    >
      <template v-slot:top>
        <div class="headerTable">
          <v-toolbar flat prominent>
            <v-toolbar-title
              ><b>Tablica wynikowa {{ dateNow }}</b></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-col class="d-flex mt-5 ml-10" cols="1" sm="2">
              <v-select
                :items="shifts"
                outlined
                label="Wybierz zmianę"
                v-model="selectedShift"
              ></v-select>
            </v-col>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline"
                  >Napewno chcesz usunuć
                  {{
                    editedItem.name + " " + editedItem.lastName
                  }}?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-divider></v-divider>
          <v-toolbar flat prominent>
            <div class="search ml-16">
              <v-text-field
                class="mt-10"
                v-model="search"
                append-icon="mdi-magnify"
                label="Szukaj pracownika..."
                hide-details
              ></v-text-field>
              <v-col class="d-flex mt-5 ml-10">
                <v-select
                  :items="dates"
                  label="Wybierz miesiąc"
                  solo
                  v-model="selectedDate"
                ></v-select>
              </v-col>
            </div>
            <h1 class="mt-5 monthName">{{ monthName }}</h1>
          </v-toolbar>
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon medium color="red" class="ml-5" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-progress-linear indeterminate color="cyan"></v-progress-linear>
        <v-col class="subtitle-1 text-center" cols="12"> Czekaj... </v-col>
        <v-btn color="primary" @click="initialize"> Uruchom ponownie </v-btn>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["Workers"],
  data: () => ({
    snackbar: false,
    text: "",
    redactMode: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    monthName: "",
    selectedDate: "",
    dateNow: "",
    dates: [],
    shifts: ["Wszystkie", "Dzień", "Noc"],
    selectedShift: "Wszystkie",
    headers: [
      {
        text: "Imię",
        value: "name",
        width: "15%",
        align: "center",
      },
      {
        text: "Nazwisko",
        value: "lastName",
        width: "15%",
        align: "center",
      },
      {
        text: "Zmiana",
        value: "shift",
        sortable: false,
        align: "center",
      },
      {
        text: "Stawkę (zł)",
        value: "rate",
        sortable: false,
        align: "center",
      },
      {
        text: "Ilość dni",
        value: "countDay",
        sortable: false,
        align: "center",
      },
      {
        text: "Wynagrodzenie (zł)",
        value: "salary",
        sortable: false,
        align: "center",
      },
      {
        text: "Edytuj",
        value: "actions",
        sortable: false,
        width: "10%",
        align: "center",
      },
    ],
    workers: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      lastName: "",
      startDate: "",
      rate: 0,
      shift: "",
    },
    defaultItem: {
      name: "",
      lastName: "",
      startDate: "",
      rate: 0,
      shift: "",
    },
  }),

  computed: {
    getMonthInYear() {
      let arrMonth = [];
      for (let i = 1; i <= 12; i++) {
        let month;
        if (i <= 9) {
          month = "0" + i;
        } else {
          month = i;
        }
        arrMonth.push(this.dateNow.split("-")[0] + "-" + month);
      }
      return arrMonth;
    },
    getMonth() {
      let nowMonth;
      let getMonth = this.selectedDate.split("-")[1];
      switch (getMonth) {
        case "01":
          nowMonth = "Styczeń";
          break;
        case "02":
          nowMonth = "Luty";
          break;
        case "03":
          nowMonth = "Marzec";
          break;
        case "04":
          nowMonth = "Kwiecień";
          break;
        case "05":
          nowMonth = "Maj";
          break;
        case "06":
          nowMonth = "Czerwiec";
          break;
        case "07":
          nowMonth = "Lipiec";
          break;
        case "08":
          nowMonth = "Sierpień";
          break;
        case "09":
          nowMonth = "Wrzesień";
          break;
        case "10":
          nowMonth = "Październik";
          break;
        case "11":
          nowMonth = "Listopad";
          break;
        case "12":
          nowMonth = "Grudzień";
          break;
      }

      return nowMonth;
    },
  },
  watch: {
    Workers() {
      this.workers = [];
      this.initialize();
    },
    selectedDate() {
      this.workers = [];
      this.monthName = this.getMonth;
      this.initialize();
    },
    selectedShift() {
      this.workers = [];
      let shift;
      if (this.selectedShift === "Dzień") {
        shift = "Day";
      } else if (this.selectedShift === "Noc") {
        shift = "Night";
      } else if (this.selectedShift === "Wszystkie") {
        shift = "AllShift";
      }
      this.setShift(shift);
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
      this.selected = this.workers;
    },
  },

  created() {
    this.getDateNow();
    this.selectedDate =
      this.dateNow.split("-")[0] + "-" + this.dateNow.split("-")[1];
    this.dates = this.getMonthInYear;
    this.initialize();
    this.tableShift = this.shift;
  },

  methods: {
    ...mapActions([
      "getWorkers",
      "addNewWorker",
      "addCountDay",
      "setWorker",
      "removeWorkerInYear",
      "setShift",
    ]),
    getDateNow() {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      if (day <= 9) day = "0" + day;
      if (month < 9) {
        month = "0" + Number(month + 1);
      } else {
        month = Number(month + 1);
      }
      let nowDate = year + "-" + month + "-" + day;
      this.dateNow = nowDate;
    },

    initialize() {
      for (let worker of this.Workers) {
        if (
          worker.year == this.selectedDate.split("-")[0] &&
          worker.month[this.selectedDate.split("-")[1]]
        ) {
          let day = worker.month[this.selectedDate.split("-")[1]].length;
          this.workers.push({
            _id: worker._id,
            name: worker.name,
            lastName: worker.lastName,
            shift: worker.shift,
            rate: worker.rate,
            countDay: day,
            salary: Number(day) * Number(worker.rate),
          });
        }
      }
    },

    deleteItem(item) {
      this.redactMode = false;
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.removeWorkerInYear(this.editedItem);
      this.text = "Usunełeś pracownika z tablicy!";
      this.snackbar = true;
      this.closeDelete();
    },
    close() {
      this.redactMode = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.search {
  max-width: 50%;
  display: flex;
}
.monthName {
  width: 50%;
  text-align: center;
}
.dateNow {
  font-weight: bold;
  font-size: 24px;
  margin-left: 50px;
}
.footerTable {
  display: flex;
}
</style>
