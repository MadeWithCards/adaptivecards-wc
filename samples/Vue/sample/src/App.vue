<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <adaptive-card 
      mode='dark'
      ref="card1"
      template-id="5409bd9a-6e2c-4a4b-869a-af7fabd4cbcb" 
      @cardSubmit="submitCard" />

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {


  mounted() {
    var card = this.$refs["card1"];
    console.log(card);
    card.beforeSubmit = this.beforeSubmit;
    card.afterSubmit = this.afterSubmit;
  }

  submitCard(data: any) {
    alert(data)
  }

  beforeSubmit(data: any): boolean {
    console.log(data);
    return true;
  }

  afterSubmit(data: any): boolean {
    console.log(data);
    return true;
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
