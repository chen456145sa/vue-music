<template>
  <div class="rank">
    <MScroll class="wrapper" @scroll="scroll">
      <ul>
        <li class="item" v-for="(item,key) in arr" :key="key">{{item}}</li>
      </ul>
    </MScroll>
  </div>

</template>

<script>
import MScroll from "@/components/base/scroll/iscroll2"
export default {
  data () {
    return {
      arr: [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    }
  },
  components: {
    MScroll
  },
  methods: {
    scroll(pos) {
      console.log(pos)
    }
  }
}
</script>

<style scoped>
  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
  .wrapper {
    height: 100%;
    overflow: hidden;
  }
  .item {
    padding-top: 30px;
  }
</style>