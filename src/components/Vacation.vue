<template>
  <div>
    <v-card class="mx-auto" min-width="400">
      <v-toolbar color="teal" dark>
        <v-toolbar-title>Topics</v-toolbar-title>
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
              <v-list-item-title
                class="ma-0 pa-0 list-item"
                v-text="child.title"
              ></v-list-item-title>
            </v-list-item-content>
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
  props: ["dateNow", "shift"],
  data: () => ({
    vacType: [
      {
        action: "mdi-home",
        items: [],
        title: "Wolny",
      },
      {
        action: "mdi-hospital-box",
        items: [],
        title: "Chorobowy",
      },
      {
        action: "mdi-island",
        items: [],
        title: "Urlopy",
      },
    ],
  }),
  created() {
    this.getVacations();
  },
  watch: {
    allVacation() {
      console.log("qwerwqr");
      this.setdayOff();
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
    allVacation() {
      return this.getVacState.allVacation;
    },
  },
  methods: {
    ...mapActions(["getVacations"]),
    setdayOff() {
      let vacArr = [];
      for (let vac of this.dayOff) {
        vacArr.push({
          title:
            vac.name +
            " " +
            vac.lastName +
            " (" +
            vac.start +
            "-" +
            vac.end +
            ")",
        });
      }
      console.log(vacArr);
      this.vacType[0].items = vacArr;
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
  font-size: 24px;
}
</style>
