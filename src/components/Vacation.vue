<template>
  <div>
    <v-card class="mx-auto" min-width="400">
      <v-toolbar color="teal" dark>
        <v-toolbar-title>Сzasowo zwolniony z pracy:</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-group
          v-for="item in vacType"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title">
            <v-list-item-content>
              <v-list-item-subtitle
                class="ma-0 pa-0"
                v-text="child.title"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :disabled="
                  child.vacInfo.type == 'holidays' &&
                  child.vacInfo.start <= dateNow &&
                  child.vacInfo.end >= dateNow
                "
                class="mx-2"
                @click="deleteVac(child.vacInfo)"
                icon
                outlined
                x-small
                color="error"
              >
                <v-icon dark> mdi-minus </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Vacation",
  props: ["dateNow", "shift", "getSelected"],
  data: () => ({
    vacType: [
      {
        action: "mdi-home",
        items: [],
      },
      {
        action: "mdi-hospital-box",
        items: [],
      },
      {
        action: "mdi-island",
        items: [],
      },
      {
        action: "mdi-calendar-clock",
        items: [],
      },
    ],
  }),
  created() {
    // this.getVacations();
  },
  watch: {
    allVacation() {
      this.createTitle(this.dayOff, 0, "Wolny");
      this.createTitle(this.sickLeave, 1, "Chorobowy");
      this.createTitle(this.holidays, 2, "Urlopy");
      this.createTitle(this.planned, 3, "Zaplanowany");
    },
  },
  computed: {
    ...mapGetters(["getVacState"]),
    sickLeave() {
      return this.getVacState.sickLeave;
    },
    holidays() {
      return this.getVacState.holidays;
    },
    dayOff() {
      return this.getVacState.dayOff;
    },
    planned() {
      return this.getVacState.vacPlanned;
    },
    allVacation() {
      return this.getVacState.allVacation;
    },
  },
  methods: {
    ...mapActions(["getVacations", "removeVacation"]),
    async deleteVac(item) {
      //Удаление отпуска или запланированного выходного у работника
      await this.removeVacation(item);
      this.getVacations();
      if (
        (item.start <= this.dateNow && item.end && item.end >= this.dateNow) ||
        (item.start <= this.dateNow && !item.end)
      ) {
        this.getSelected(item._id, "AddSelected");
      }
    },
    createTitle(elem, index, title) {
      //Подготовка данных о отпусках (Работник,даты,тип выходного)
      let vacArr = [];
      let sortArr = elem.sort((a, b) => {
        var c = new Date(a.start);
        var d = new Date(b.start);
        return c - d;
      });
      for (let vac of sortArr) {
        if (title == "Zaplanowany") {
          let typeName = "";
          if (vac.type == "dayOff") {
            typeName = "W";
          }
          if (vac.type == "holidays") {
            typeName = "U";
          }
          if (vac.type == "sickLeave") {
            typeName = "CH";
          }

          vacArr.push({
            title:
              vac.name +
              " " +
              vac.lastName +
              " (" +
              vac.start +
              (vac.end ? " --- " + vac.end + ")" : ")") +
              " " +
              typeName,
            vacInfo: vac,
          });
        } else {
          vacArr.push({
            title:
              vac.name +
              " " +
              vac.lastName +
              " (" +
              vac.start +
              (vac.end ? " --- " + vac.end + ")" : ")"),
            vacInfo: vac,
          });
        }
      }
      this.vacType[index].items = vacArr;
      this.vacType[index].title = title + " (" + vacArr.length + ")";
    },
  },
};
</script>
<style lang="scss" scoped>
.v-application--is-ltr
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding-left: 10px !important;
  min-height: 0px;
}
.v-list-item__content {
  padding: 5px 0;
}
.v-list-item__subtitle {
  color: black !important;
}
</style>
