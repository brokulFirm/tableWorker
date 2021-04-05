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
          <v-btn elevation="2" color="success" @click="printPresent"
            >W pracę</v-btn
          >
        </v-col>
        <v-col>Drukuj</v-col>
        <v-col>
          <v-btn elevation="2" color="success" @click="printOut">Wolne</v-btn>
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
    outPlanned: [],
    present: [],
  }),

  watch: {
    date() {
      this.outPlanned = this.getVacation.filter((i) => {
        let start = new Date(i.start);
        let end = new Date(i.end);
        let now = new Date(this.date);
        if (start <= now && i.end && end >= now) return i;
        else if (+start == +now) return i;
      });
      this.present = this.workers.filter(
        (e) => this.outPlanned.findIndex((i) => i._id == e._id) === -1
      );
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    getVacation() {
      let newVacArr;
      if (this.getVacState.vacNow && this.getVacState.vacPlanned) {
        newVacArr = this.getVacState.vacNow.concat(this.getVacState.vacPlanned);
      } else if (this.getVacState.vacNow && !this.getVacState.vacPlanned) {
        newVacArr = this.getVacState.vacNow;
      } else if (!this.getVacState.vacNow && this.getVacState.vacPlanned) {
        newVacArr = this.getVacState.vacPlanned;
      }
      return newVacArr;
    },
    computedDateFormattedMomentjs() {
      moment.locale("pl");
      return this.date ? moment(this.date).format("dddd, D MMMM  YYYY") : "";
    },
  },
  methods: {
    printPresent() {
      const newWindow = window.open();
      let stylesMain = "h3{ margin-left: 250px; }";
      let test = this.present.map((i) => {
        return "<li>" + i.name + " " + i.lastName + "</li>";
      });
      let html = "<ol>";
      html += test.join(" ");
      html += "</ol>";
      console.log(test);
      newWindow.document.write(`<style>${stylesMain}</style>`);
      newWindow.document.write('<div class="print">');
      newWindow.document.write(`<h3>W prace ${this.date}:</h3>`);
      newWindow.document.write(html);
      newWindow.document.write("</div>");
      newWindow.print();
      newWindow.close();
    },
    printOut() {
      const newWindow = window.open();
      let stylesMain = "h3{ margin-left: 250px; }";
      let test = this.outPlanned.map((i) => {
        return "<li>" + i.name + " " + i.lastName + "</li>";
      });
      let html = "<ol>";
      html += test.join(" ");
      html += "</ol>";
      console.log(test);
      newWindow.document.write(`<style>${stylesMain}</style>`);
      newWindow.document.write('<div class="print">');
      newWindow.document.write(`<h3>Wolny ${this.date}:</h3>`);
      newWindow.document.write(html);
      newWindow.document.write("</div>");
      newWindow.print();
      newWindow.close();
    },
  },
};
</script>
<style lang="scss" scoped></style>
