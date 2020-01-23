<template>
  <div class="progress-circle">
    <el-progress type="circle" :percentage="currentTime" :width=40 :show-text=false :stroke-width=4>
    </el-progress>
  </div>
</template>

<script>

export default {
  data() {
      return {
          per: 0,
      }
  },
  computed: {
      percent() {
          return this.currentTime / this.duration
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

  }

}
</script>

<style scoped>

</style>