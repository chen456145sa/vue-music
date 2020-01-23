<template>
  <div class="block">
    <el-slider v-model="value1" :max="duration" ref="slider" :show-tooltip="false" @change="change"></el-slider>
  </div>
</template>

<script>

export default {
  data() {
      return {
          value1: 0
      }
  },
  props: {
    duration: {
        type: Number,
        default: 100
    },
    percent: {
        type: Number,
        default: 0
    }
  },
  mounted() {

  },
  methods: {
      change(newV) {
        this.value1 = newV;
        // console.log(this.$refs.slider.$el.currentTime)
        // this.$refs.slider.currentTime = newV
        this.$emit('change',newV);
        console.log(newV)
      }
  },
  watch: {
    percent(newP) {  //设置进度条
        // console.log('newP:'+newP)
        this.value1 = newP
    }
  }

}
</script>

<style scoped>

</style>