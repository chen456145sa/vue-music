<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  data () {
    return {
    //    scroll: null
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
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: Boolean,
      default: false
  },
  mounted() {
      var _self = this;
      setTimeout(function(){
          _self.initScroll();
      },1000)
      setTimeout(function(){
          _self.refresh();
          console.log('refresh')
      },4000)
  },
  methods: {
      initScroll() {  //初始化
          if(!this.$refs.wrapper){
              return
          }
          this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType,
              click: this.click
          })
          if (this.listenScroll) { //监听滚动事件
            let _self = this;
            this.scroll.on('scroll', (pos) => {
                _self.$emit('scroll', pos)
            })
          }

          if(this.pullup) {  //上拉滚动
              let _self = this;
              this.scroll.on('scrollEnd', () => {
                  if(_self.scroll.y <= _self.scroll.maxScrollY + 50) {
                      _self.$emit('scrollToEnd')
                    //   console.log('scrollEnd')
                  }
            })
          }
      },
      enable() {
          this.scroll && this.scroll.enable();
      },
      disable() {
          this.scroll && this.scroll.disable();
      },
      refresh() {
          this.scroll && this.scroll.refresh();
        //   console.log("refresh..");
        //   console.log(this.scroll);
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
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