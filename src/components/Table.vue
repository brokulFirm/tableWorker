<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="workers"
      :search="search"
      sort-by="name"
      class="elevation-1"
      show-expand
      show-select
      item-key="_id"
      single-expand
      :expanded.sync="expanded"
      @toggle-select-all="selectAllRedact"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td class="pa-3" :colspan="headers.length">
          <div class="d-flex">
            <WorkerVac
              :worker="item"
              :dateNow="selectedDate"
              :getSelected="getSelected"
              :outputId="outputId"
            />
            <v-divider vertical></v-divider>
            <WorkerInfo :worker="item" />
          </div>
        </td>
      </template>
      <template v-slot:item.data-table-select="{ item, isSelected, select }">
        <v-simple-checkbox
          :value="!outputId.includes(item._id) && isSelected"
          :readonly="outputId.includes(item._id)"
          :disabled="outputId.includes(item._id)"
          @input="select($event)"
        ></v-simple-checkbox>
      </template>
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
            <div class="warn">
              <h3>UWAGA!!!</h3>
              <p>
                Teraz możesz w razie potrzeby usunąć urlopy i chorobowe. Nie
                możesz usunąć tylko aktualnych urlopów.
              </p>
            </div>
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
                    <v-form ref="form" v-model="valid">
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name"
                            :rules="nameRules"
                            label="Imię"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.lastName"
                            :rules="nameRules"
                            label="Nazwisko"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.number"
                            :counter="9"
                            :rules="numberRules"
                            label="Numer telefonu"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-if="!redactMode"
                            v-model="dateStart"
                            label="Paczątek pracy"
                          ></v-text-field>
                          <v-text-field
                            v-else
                            v-model="editedItem.startDate"
                            label="Paczątek pracy"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            type="number"
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
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.adres"
                            label="Adres zamieszkania"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-model="editedItem.contract"
                            :items="contractType"
                            label="Rodzja umowy"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.vacDay"
                            label="Ilość dni urlopu"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Anuluj
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="!valid"
                    text
                    @click="save"
                  >
                    Zapisać
                  </v-btn>
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
                    >Anuluj</v-btn
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
          <v-toolbar height="150" flat prominent>
            <div class="search ml-16 mt-3">
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
            <h1 class="mt-10 monthName">{{ monthName }}</h1>
            <PlanningWorker :dateNow="selectedDate" :workers="Workers" />
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
      </template>
    </v-data-table>

    <div class="footerTable mt-5 justify-space-around">
      <TodoList :shift="shift" :todos="todos" />
      <Vacation
        :dateNow="selectedDate"
        :shift="shift"
        :getSelected="getSelected"
      />
      <div class="alerts">
        <v-alert color="blue-grey" border="right" dark max-width="400"
          >Wszystkich pracownikow w zmianie: {{ workers.length }} --- Dziś jest
          :{{ selected.length }}
        </v-alert>
        <v-alert type="info" max-width="400">
          Dziś nie ma ( {{ workers.length - selected.length }} ):
          {{ output.join(", ") }}
        </v-alert>
      </div>
      <div>
        <v-alert
          v-if="alertText"
          border="left"
          outlined
          text
          :type="alertType"
          >{{ alertText }}</v-alert
        >
        <v-btn
          class="mt-1"
          :disabled="disComfirm"
          color="primary"
          elevation="2"
          large
          rounded
          @click="confirmDay"
          >Zatwierdź dzień</v-btn
        >
      </div>
    </div>
    <v-snackbar :color="snackbarType" text v-model="snackbar" :timeout="3000">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Zamkni
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import TodoList from "./TodoList";
import WorkerVac from "./WorkerVac";
import WorkerInfo from "./WorkerInfo";
import Vacation from "./Vacation";
import PlanningWorker from "./PlanningWorker";
export default {
  props: ["Workers", "shift", "submitStatus", "todos", "vacation"],
  components: {
    TodoList,
    WorkerVac,
    Vacation,
    WorkerInfo,
    PlanningWorker,
  },
  data: () => ({
    outputId: [],
    valid: true,
    nameRules: [(v) => !!v || "Nie może być puste."],
    numberRules: [(v) => v == Number(v) || "Tylko cyfry"],
    alertType: "",
    alertText: "",
    tableShift: "",
    snackbar: false,
    snackbarType: "",
    text: "",
    redactMode: false,
    search: "",
    dialog: false,
    dialogDelete: false,
    dates: [],
    monthName: "",
    selected: [],
    expanded: [],
    output: [],
    selectedDate: "",
    prevDate: "",
    dateStart: "",
    disComfirm: false,
    selectedAllCount: 0,
    contractType: ["Zlecenie", "Działalność"],
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
      { text: "Dodatkowa informacja", value: "data-table-expand" },
      { text: "Numer Tel.", value: "number", sortable: false, align: "center" },
      {
        text: "Data zatrudnienia",
        value: "startDate",
        sortable: false,
        align: "center",
      },
      {
        text: "Badanie san.epid.",
        value: "medicalBoard",
        sortable: false,
        align: "center",
      },
      { text: "Stawkę (zł)", value: "rate", sortable: false, align: "center" },
      { text: "Edytuj", value: "actions", sortable: false, align: "center" },
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
      adres: "",
      contract: "",
      vacDay: "",
    },
    defaultItem: {
      name: "",
      lastName: "",
      startDate: "",
      rate: 0,
      shift: "",
      number: "",
      medicalBoard: "",
      adres: "",
      contract: "",
      vacDay: "",
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
    getOutpuId() {
      //Блокирует строку таблицы работника который находиться в отпуске
      let outId = [];
      this.vacation.forEach((i) => {
        outId.push(i._id);
      });
      return outId;
    },
    getOutput() {
      //Показываем отстутвующих работников на данный момент
      let outPutArr = this.workers.filter(
        (e) => this.selected.findIndex((i) => i._id == e._id) === -1
      );
      let outPutName = [];
      for (let worker of outPutArr) {
        outPutName.push(worker.name + " " + worker.lastName);
      }
      return outPutName;
    },
  },
  watch: {
    getOutpuId() {
      this.outputId = this.getOutpuId;
      if (this.prevDate != this.selectedDate) {
        this.getSelected();
      }
      this.prevDate = this.selectedDate;
    },
    selected() {
      this.output = this.getOutput;
    },
    submitStatus() {
      this.disComfirm = false;
      //Проверяем какой статус пришел из сервера. (Изменять type в дальнейшем)
    },
    Workers() {
      this.initialize();
      if (this.selected.length == 0 && this.Workers.length > 0) {
        this.getSelected();
      }
      if (this.selected.length > this.workers.length) {
        this.getSelected();
      }
    },
    selectedDate() {
      this.setSelectedDate(this.selectedDate);
      this.monthName = this.getMonth;
      this.alertText = "";
      this.dateStart = this.selectedDate;
      this.getSelected();
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
      this.selected = this.selected.filter((i) => {
        return i._id != this.editItem._id;
      });
    },
  },
  created() {
    this.initialize();
    this.getSelected();
    this.tableShift = this.shift;
    this.getDateNow();
    this.selectedDate = this.dates[0];
    this.setSelectedDate(this.selectedDate);
    this.prevDate = this.selectedDate;
  },

  methods: {
    ...mapActions([
      "getWorkers",
      "addNewWorker",
      "addCountDay",
      "setWorker",
      "removeWorker",
      "setSelectedDate",
      "getVacations",
    ]),
    selectAllRedact() {
      //Временное решения проблемы добавления заблокированых работников в селектед
      if (this.selectedAllCount === 0) {
        this.selected = this.workers.filter(
          (e) => this.vacation.findIndex((i) => i._id == e._id) === -1
        );
        this.selectedAllCount++;
      } else if (this.selectedAllCount === 1) {
        this.selected = [];
        this.selectedAllCount = 0;
      }
    },
    getDateNow() {
      //Получаем 2 даты для выбора в селекте(сегодня и вчера)
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
      //Определяем список работников
      if (this.workers.length && this.workers.length < this.Workers.length) {
        this.workers = this.Workers;
        this.selected.push(this.Workers.reverse()[0]); //При добавлении нового работника, отмечаем его как присутствующего
      } else {
        this.workers = this.Workers;
      }
    },
    getSelected(payload, message) {
      //Определяем список работников которые присутствуют
      let vacArr = this.workers.filter(
        (e) => this.vacation.findIndex((i) => i._id == e._id) === -1
      );
      if (message) {
        if (message === "RemoveSelected") {
          this.selected = this.selected.filter((i) => i._id != payload);
        } else if (message === "AddSelected") {
          let addedWorker = this.workers.find((i) => i._id == payload);
          this.selected.push(addedWorker);
        }
      } else {
        this.selected = vacArr;
      }
    },
    editItem(item) {
      //Редактирование данных определенного работника
      this.redactMode = true;
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      //Выбераем работника для удаления
      this.redactMode = false;
      this.editedIndex = this.workers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //Подтверждение удаления работника
      this.removeWorker(this.editedItem);
      this.text = "Usunełeś pracownika z tablicy!";
      this.snackbarType = "warning";
      this.snackbar = true;
      this.closeDelete();
    },

    close() {
      //Закрытие всплывающих окон для удаления, добавления и редактирования работника
      this.redactMode = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.dateStart = this.selectedDate;
    },

    closeDelete() {
      //Кнопка отмены удаления
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      //Сохранение отредактированных данных работника
      if (this.editedIndex > -1) {
        this.$refs.form.validate();
        if (this.selected.findIndex((i) => i._id === this.editedItem._id) != -1)
          this.selected.splice(
            this.selected.findIndex((i) => i._id === this.editedItem._id),
            1,
            this.editedItem
          );
        await this.setWorker(this.editedItem);
        if (this.submitStatus == "Success") {
          this.snackbarType = "primary";
          this.text = "Dane pracownika zostali zmienione!!!";
          this.snackbar = true;
        } else if (this.submitStatus == "Error") {
          this.snackbarType = "error";
          this.text = "Coś poszło nie tak, spróbój jescze raz";
          this.snackbar = true;
        }
        this.getWorkers();
      } else {
        //Сохранение нового работника
        if (this.shift === "Day") this.editedItem.shift = "Dzień";
        if (this.shift === "Night") this.editedItem.shift = "Noc";
        this.editedItem.startDate = this.dateStart;
        this.$refs.form.validate();
        await this.addNewWorker(this.editedItem);
        if (this.submitStatus == "Success") {
          this.snackbarType = "success";
          this.text = "Dodaleś nowego pracownika!!!";
          this.snackbar = true;
        } else if (this.submitStatus == "Error") {
          this.snackbarType = "error";
          this.text = "Coś poszło nie tak, spróbój jeszcze raz";
          this.snackbar = true;
        }
        this.getWorkers();
        this.dateStart = this.selectedDate;
      }
      this.close();
    },
    async confirmDay() {
      //Подтверждение рабочего дня
      this.disComfirm = true;
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
          contract: elem.contract,
        };
        arrCount.push(workCount);
      }

      await this.addCountDay(arrCount);
      if (this.submitStatus == "Success") {
        this.alertText = this.selectedDate + " " + "Dzień zatwierdzony";
        this.alertType = "success";
      } else if (this.submitStatus == "Error") {
        this.alertText = "Coś poszło nie tak, spróbój uruchomić ponownie";
        this.alertType = "error";
      }
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
.warn {
  text-align: center;
  padding: 0px;
  background: rgb(179, 252, 85);
  max-width: 600px;
  p {
    font-size: 14px;
    line-height: 1;
  }
}
</style>
