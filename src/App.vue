<template>
  <div id="app">
    <mheader></mheader>
    <m-Tab></m-Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import mheader from './components/Header'
import MTab from "@/components/tab/tab";
import Player from "@/components/player/player";

export default {
  name: 'App',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    mheader,
    MTab,
    Player
    
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  /* margin-top: 60px; */
}

</style>
