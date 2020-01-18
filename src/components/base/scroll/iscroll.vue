<template>
  <iscroll-view class="scroll-view" ref="scrollView">
    <slot></slot>
  </iscroll-view>
</template>

<script>
export default {
  props: {
      arrayData: {
          type: Array,
          default: null
      },
      probeType: {
          type: Number,
          default: 1
      },
      click: {
          type: Boolean,
          default: true
      },
      listenScroll: {
          type: Boolean,
          default: true
      }
  },
  mounted() {
    var _self = this;
    setTimeout(function(){
      _self.$refs.scrollView.refresh();
    },3000)
      
  },
  methods: {
      refresh() {
        this.$refs.scrollView.refresh();
        //console.log(this.$refs.scrollView)
        // console.log(this.scroll)
      },
      scrollTo() {
        this.$refs.scrollView.scrollTo.apply(this.$refs.scrollView, arguments);
      },
      scrollToElement() {
        this.$refs.scrollView.scrollToElement.apply(this.$refs.scrollView, arguments);
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
.scroll-view {
  /* -- Attention: This line is extremely important in chrome 55+! -- */
  touch-action: none;
  /* -- Attention-- */
  /* position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0; */
  overflow: hidden;
  height: 100%;
}
</style>