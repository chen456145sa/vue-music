<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  data () {
    return {
       scroll: null
    }
  },
  props: {
      probeType: {
          type: Number,
          default: 1
      },
      click: {
          type: Boolean,
          default: true
      },
      arrayData: {
          type: Array,
          default: null
      }
  },
  mounted() {
      var _self = this;
      setTimeout(function(){
          _self.initScroll();
      },2000)
      setTimeout(function(){
          _self.refresh();
      },4000)
  },
  methods: {
      initScroll() {
          if(!this.$refs.wrapper){
              return
          }
          this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType,
              click: this.click
          })
      },
      enable() {
          this.scroll && this.scroll.enable();
      },
      disable() {
          this.scroll && this.scroll.disable();
      },
      refresh() {
          this.scroll && this.scroll.refresh();
          console.log("refresh..");
          console.log(this.scroll);
      }
        
  },
  watch: {
      arrayData() {
          this.refresh();
      }
  }

}
</script>

<style scoped>

</style>