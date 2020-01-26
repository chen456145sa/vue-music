<template>
  <div class="progress-circle">
    <el-progress type="circle" :percentage="percent" :width=40 :show-text=false :stroke-width=4>
    </el-progress>
  </div>
</template>

<script>

export default {
  computed: {
      percent() {
          return (this.currentTime / this.duration)*100
      }
  },
  props: {
    duration: {
        type: Number,
        default: 100
    },
    currentTime: {
        type: Number,
        default: 0
    }
  },
  mounted() {

  },
  methods: {
     
  },
  watch: {
    // percent(oldp,newp) {
    //   console.log('oldp' +oldp)
    //   console.log('newp'+ newp)
    // }
  }

}
</script>

<style scoped>

</style>