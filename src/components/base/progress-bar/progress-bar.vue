<template>
  <div class="block" @touchstart="progressTouchStart">
    <el-slider v-model="value1" :max="duration" ref="slider" :show-tooltip="false" 
    @change="change" ></el-slider>
  </div>
</template>

<script>

export default {
  data() {
      return {
          value1: 0,
          drag: false
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
      change(newV) {  //拖拽结束时触发
        this.value1 = newV;
        this.$emit('change',newV);
        // console.log(newV)
        this.drag = false;
      },
      progressTouchStart() {
        this.drag = true;
        // console.log("progressTouchStart")
      }
      // progressTouchMove() { //解决
      //   return false
      // }
  },
  watch: {
    percent(newP) {  //设置进度条
        // console.log('newP:'+newP)
        if(!this.drag) {
          this.value1 = newP
        }
        
    }
    // drag(newD) {
    //   console.log("newD:"+newD)
    // }
  }

}
</script>

<style scoped>

</style>