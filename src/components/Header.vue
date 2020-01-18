<template>
  <div id='header'>
    <h1>快音乐</h1>
  </div>
</template>

<script>

export default {
  
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    
  }
}
</script>

<style scoped>
  #header {
    height: 45px;
    background-color: rgb(48, 118, 247);
    position: relative;
  }
  h1 {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    font-size: 16px;
  }
</style>
