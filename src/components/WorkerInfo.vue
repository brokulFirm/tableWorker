<template>
  <div class="main ma-2">
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
    </div>
  </div>
</template>
<script>
export default {
  name: "WorkerInfo",
  props: ["worker"],
  data: () => ({
    cotractType: ["Zlecenie", "Działalność"],
  }),
};
</script>
<style lang="scss" scoped>
.workerInfo {
  display: flex;
  padding: 5px;
  span {
    margin-left: 5px;
  }
}
</style>
