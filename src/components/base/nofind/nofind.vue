<template>
  <div class="nofind">
      <!-- <img src="../../../common/images/loading.gif" width="24" height="24"> -->
      <p class="desc">{{title}}</p>
  </div>
</template>

<script>

export default {
  props: {
      title: {
          type: String,
          default: '找不到结果...'
      }
  }
}
</script>

<style scoped>
.nofind {
    width: 100%;
    text-align: center;
    
}
</style>