<template>
  <div class="main">
    <div class="start">
      <h1>Witam! Wprowadz kod swojej tablicy do URL</h1>
      <h3>Przyklad: http://3.124.205.189:4040//<b>Twoj adres</b></h3>
    </div>
    <div class="img"><img src="../assets/brokulSport.jpg" /></div>
  </div>
</template>

<script>
export default {
  name: "AllShifts",
  components: {},
};
</script>
<style scoped>
.main {
  margin: 100px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.img {
  margin: 50px 0;
}
.start {
  padding: 50px;
  border: 1px solid green;
}
</style>
