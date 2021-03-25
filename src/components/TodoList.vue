<template>
  <div class="main">
    <div class="mb-3">
      <h3>Notatki i przypomnienia :</h3>
    </div>
    <div class="d-flex">
      <v-row justify="space-around">
        <v-col cols="auto">
          <v-dialog
            v-model="dialog"
            transition="dialog-bottom-transition"
            max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                dark
                color="indigo"
                class="mx-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark> mdi-plus </v-icon>
              </v-btn>
            </template>
            <template>
              <v-card>
                <v-toolbar color="primary" dark>Utwórz nową notatkę</v-toolbar>
                <v-card-text>
                  <v-textarea
                    outlined
                    v-model="description"
                    class="ma-3"
                    name="input-6-4"
                    label="Nowa notatka"
                  ></v-textarea>
                  <v-row justify="center" align="center">
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="Wybierz date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            width="200"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          :first-day-of-week="1"
                          locale="pl-PL"
                          v-model="date"
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col>
                      <span>Nie jest wymagane</span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="close">Anuluj</v-btn>
                  <v-btn text @click="saveNewTodo">Dodaj</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
      <div class="todos">
        <v-alert
          v-for="todo in todoList"
          :key="todo._id"
          v-model="alert"
          color="cyan"
          border="left"
          elevation="2"
          colored-border
          max-width="400"
          class="pa-2"
          ><div class="todoItem d-flex justify-space-between align-center">
            <div class="d-flex justify-space-between align-center">
              <strong class="ml-3 mr-3 dateTodos">
                {{ todo.date || " " }}
              </strong>
              <span class="text-caption">
                {{ todo.description }}
              </span>
            </div>
            <v-btn
              color="error"
              fab
              x-small
              class="ml-2"
              @click="deleteTodo(todo)"
            >
              <v-icon> {{ icon.mdiDelete }} </v-icon>
            </v-btn>
          </div>
        </v-alert>
      </div>
      <div v-if="!todoList.length">Nie masz jeszcze notatek</div>
    </div>
  </div>
</template>
<script>
import { mdiDelete } from "@mdi/js";
import { mapActions } from "vuex";

export default {
  name: "TodoList",
  props: ["shift", "todos"],
  data: () => ({
    icon: { mdiDelete },
    dialog: false,
    date: "",
    description: "",
    todoList: [],
  }),
  beforeUpdate() {
    this.inicialize();
  },
  mounted() {
    this.inicialize();
  },
  watch: {
    getStateTodo() {
      this.inicialize();
    },
  },
  computed: {
    getStateTodo() {
      return this.todos;
    },
  },
  methods: {
    ...mapActions(["addTodo", "removeTodo", "getTodoList"]),
    saveNewTodo() {
      let newTodo = {
        description: this.description,
        date: this.date,
        shift: this.shift,
      };
      this.addTodo(newTodo);
      this.close();
      this.getTodoList();
    },
    deleteTodo(item) {
      this.removeTodo(item);
      this.getTodoList();
    },
    close() {
      this.description = "";
      this.date = "";
      this.dialog = false;
    },
    inicialize() {
      this.todoList = this.todos;
    },
  },
};
</script>
<style lang="scss" scoped>
.dateTodos {
  white-space: nowrap;
  font-size: 12px;
}
</style>
