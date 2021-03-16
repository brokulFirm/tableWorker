<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="workers"
      :search="search"
      sort-by="name"
      class="elevation-1"
      show-select
      item-key="_id"
    >
      <template v-slot:top>
        <div class="headerTable">
          <v-toolbar flat>
            <v-toolbar-title
              ><b
                >Zmiana
                {{ shift && shift == "Day" ? "Dzienna" : "Nocna" }}
                {{ selectedDate }}</b
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  elevation="11"
                  color="teal"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Dodać nowego pracownika
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Imię"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="Nazwisko"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.number"
                          label="Numer telefonu"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="!redactMode" cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="selectedDate"
                          label="Paczątek pracy"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.rate"
                          label="Stawkę"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.medicalBoard"
                          label="Badania san.epid."
                          hint="rrrr-mm-dd"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
              <v-col class="d-flex mt-5 ml-10" cols="12" sm="6">
                <v-select
                  :items="dates"
                  label="Wybierz datę"
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
        <v-icon color="light-blue darken-4" medium @click="editItem(item)">
          mdi-pencil
        </v-icon>
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

    <div class="footerTable mt-5 justify-space-around">
      <div class="alerts">
        <v-alert color="blue-grey" border="right" dark max-width="500"
          >Wszystkich pracownikow w zmianie: {{ workers.length }}
        </v-alert>
        <v-alert type="info" max-width="500">
          Dziś nie ma ( {{ workers.length - selected.length }} ):
          {{ output.join(", ") }}
        </v-alert>
      </div>
      <div class="mt-5">
        <v-btn color="primary" elevation="2" large rounded @click="confirmDay"
          >Zatwierdź dzień</v-btn
        >
      </div>
    </div>
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
  props: ["Workers", "shift"],
  data: () => ({
    tableShift: "",
    snackbar: false,
    text: "",
    redactMode: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    dates: [],
    monthName: "",
    selected: [],
    output: [],
    selectedDate: "",
    headers: [
      {
        text: "Imię",
        align: "start",
        value: "name",
      },
      {
        text: "Nazwisko",
        align: "start",
        value: "lastName",
      },
      { text: "Numer Tel.", value: "number", sortable: false },
      { text: "Data zatrudnienia", value: "startDate", sortable: false },
      { text: "Badanie san.epid.", value: "medicalBoard", sortable: false },
      { text: "Stawkę (zł)", value: "rate", sortable: false },
      { text: "Edytuj", value: "actions", sortable: false },
    ],
    workers: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      lastName: "",
      startDate: "",
      rate: 0,
      shift: "",
      number: "",
      medicalBoard: "",
    },
    defaultItem: {
      name: "",
      lastName: "",
      startDate: "",
      rate: 0,
      shift: "",
      number: "",
      medicalBoard: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nowy pracownik"
        : "Edytuj dane pracownika";
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
  beforeUpdate() {
    this.getOutput();
  },
  watch: {
    Workers() {
      this.initialize();
      if (this.selected.length == 0) {
        this.selected = this.workers;
      }
    },
    selectedDate() {
      this.monthName = this.getMonth;
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
    this.initialize();
    this.selected = this.workers;
    this.tableShift = this.shift;
    this.getDateNow();
    this.selectedDate = this.dates[0];
  },

  methods: {
    ...mapActions([
      "getWorkers",
      "addNewWorker",
      "addCountDay",
      "setWorker",
      "removeWorker",
    ]),
    getOutput() {
      const outPutArr = this.workers.filter(
        (e) => this.selected.findIndex((i) => i._id == e._id) === -1
      );
      let outPutName = [];
      for (let worker of outPutArr) {
        outPutName.push(worker.name + " " + worker.lastName);
      }
      this.output = outPutName;
    },
    getDateNow() {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let dateYest = new Date(year, month, day - 1);
      let yeastDay = dateYest.getDate();
      let yeastMonth = dateYest.getMonth();
      if (day <= 9) day = "0" + day;
      if (month < 9) {
        month = "0" + Number(month + 1);
      } else {
        month = Number(month + 1);
      }
      if (yeastDay <= 9) yeastDay = "0" + yeastDay;
      if (yeastMonth < 9) {
        yeastMonth = "0" + Number(yeastMonth + 1);
      } else {
        yeastMonth = Number(yeastMonth + 1);
      }
      let nowDate = year + "-" + month + "-" + day;
      let yestDate = dateYest.getFullYear() + "-" + yeastMonth + "-" + yeastDay;
      this.dates = [nowDate, yestDate];
    },
    initialize() {
      this.workers = this.Workers;
    },

    editItem(item) {
      this.redactMode = true;
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.redactMode = false;
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.removeWorker(this.editedItem);
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

    save() {
      if (this.editedIndex > -1) {
        this.setWorker(this.editedItem);
        this.text = "Dane pracownika zostali zmienione!!!";
        this.snackbar = true;
      } else {
        if (this.shift === "Day") this.editedItem.shift = "Dzień";
        if (this.shift === "Night") this.editedItem.shift = "Noc";
        this.editedItem.startDate = this.selectedDate;
        this.addNewWorker(this.editedItem);
        this.getWorkers();
        this.text = "Dodaleś nowego pracownika!!!";
        this.snackbar = true;
      }
      this.close();
    },
    confirmDay() {
      let arrCount = [];
      for (let elem of this.selected) {
        let workCount = {
          _id: elem._id,
          month: this.selectedDate.split("-").slice(0, 2).join("-"),
          countDay: this.selectedDate.split("-").slice(-1).join(""),
          name: elem.name,
          lastName: elem.lastName,
          shift: elem.shift,
          rate: elem.rate,
        };
        arrCount.push(workCount);
      }

      this.addCountDay(arrCount);
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
