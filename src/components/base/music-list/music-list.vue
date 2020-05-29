<template>
    <div class='music-list' v-if="show">
      <div class="top" :style="bgStyle" ref="top">
        <div class="header">
          <span class="break el-icon-back" @click="back"></span>
          <!-- <span class="el-icon-back"></span> -->
          <h1 class="name">{{this.title}}</h1>
          <a href="javascript:;" class="randomBtn" ref="randomBtn" @click.stop.prevent="randPlay"
          :class="songList.length>0? 'randomBtn':'forbitClick'">随机播放</a>
        </div>
      </div>

      <div class="bg-layer" ref="layer"></div>
      <MScroll :arrayData = "songList" :probeType =3 :listenScroll=true 
      class="songscroll" ref="songscroll" @scroll="scroll" v-if="songList.length>0">
         <div class="listwrapper">
            <songListView :songs = "songList" @select="selectItem"></songListView>
        </div>
      </MScroll>
      <div class="loading-container" v-show="!songList.length">
        <Loading></Loading>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import MScroll from "@/components/base/scroll/iscroll2"
import songListView from "@/components/base/listview/songListView"
import Loading from '@/components/base/Loading/Loading'
import {mapActions,mapMutations} from 'vuex'
import {playListMinxin} from 'common/js/minxin'

export default {
  mixins: [playListMinxin],
  data () {
    return {
      show: false,
      scrollY: 0
    }
  },
  props: {
    songList: {
        type: Array,
        default: []
    },
    bgimg: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    }
  },
  computed: {
      bgStyle() {
        return `background-image:url(${this.bgimg})`
      }
  },
  created() {
    setTimeout(() => {  //解决enter动画效果不显示问题
      this.show = true
    },20) 
  },
  mounted() {
    var _self = this;
    setTimeout(()=> {
      if(this.$refs.songscroll) {
        this.$refs.songscroll.refresh();
      }
      //遮罩层最大滚动高度
      this.maxHeight = - this.$refs.top.clientHeight + 40;
    //   console.log( this.maxHeight)
    },3000);
    
  },
  components: {
    MScroll,
    songListView,
    Loading
  },
  methods: {
    //当要同时派发几个commit时调用
    ...mapActions([   
        'selectPlay',
        'randomPlay'
    ]),
    ...mapMutations({
      setClicked: 'SET_CLICK_FLAG'
    }),
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(song,index) {  //接受song-list派发的点击事件 
      this.selectPlay({
          list: this.songList,
          index
      })
      this.setClicked(true);   //设置clicked 
    },
    randPlay() {
      this.randomPlay({
        list: this.songList
      })
    },
    handlePlayList(list) { //处理底部（播放器遮挡）适配问题
      let bottom = list.length>0 ? '80px' : '';
      // console.log(this.$refs.songscroll)
      setTimeout(() => {
        // console.log( this.$refs.songscroll)
        if(this.$refs.songscroll) {
          this.$refs.songscroll.$el.style.bottom = bottom;
          this.$refs.songscroll.refresh();
        }
      },1001)
      
    }
  },
  watch: {
    scrollY(newY) { //设置遮罩层的滚动
      let translateY = Math.max( - this.$refs.top.clientHeight + 40 ,newY);
      let zIndex = 0;
      let scale = 1;
      
      
      if(newY <= 0) {  //移动遮罩
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;
        this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`;
        //通过设置背景图zindex 和 高度 实现顶部遮挡
        if(newY < this.maxHeight) {
          zIndex = 10;
          this.$refs.top.style.zIndex = zIndex;
          this.$refs.top.style.paddingTop = 0;
          this.$refs.top.style.height = 40 + "px";
          //隐藏按钮
          this.$refs.randomBtn.style.display = "none";
        }else {
          zIndex = 0;
          this.$refs.top.style.zIndex = zIndex;
          this.$refs.top.style.paddingTop = "60%";
          this.$refs.top.style.height = 0 + "px"; 
          //显示按钮
          this.$refs.randomBtn.style.display = "block";
        }
      }
      if( newY > 0) {  //缩放图片
        const percent = Math.abs(newY/ this.$refs.top.clientHeight)
        // console.log(percent)
        scale = 1+ percent;
        zIndex = 10;
        this.$refs.top.style.zIndex = zIndex;
        this.$refs.top.style['transform'] = `scale(${scale})`;
        this.$refs.top.style['webkitTransform'] = `scale(${scale})`;
      }
      
    
    }

  }
}
</script>

<style scoped>
  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgb(207, 207, 207);
  }
  .top {
    position: relative;
    width: 100%;
    height: 0;
    /* height: 35%; */
    padding-top: 60%;
    background-color: rgb(35, 148, 223);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
    transform-origin: top;
    z-index: 1;
  }
  .randomBtn {
    display: block;
    position: absolute;
    bottom: 10px;
    padding: 10px 15px;
    border-radius: 15px;
    border: 1px solid #fff;
    color: #fff;
    background-color: transparent;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .break {
    position: absolute;
    display: block;
    top: 10px;
    left: 13px;
    font-size: 26px;
    font-weight: 600;
    color: rgb(255, 104, 58);
    z-index: 11;
  }
  .name {
    position: absolute;
    top: 10px;
    margin-left: 50%;
    transform: translateX(-50%);
    /* padding-top: 10px; */
    font-size: 18px;
    font-weight: 600;
    color: rgb(255, 104, 58);
    letter-spacing: 2px;
  }

  .songscroll {
    position: fixed;
    top: 35%;
    bottom: 0;
    width: 100%;
    /* overflow: hidden; */
  }
  .bg-layer {
    height: 100%;
    width: 100%;
    background-color: rgb(253, 255, 233);
    overflow: hidden;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .forbitClick {
    pointer-events:none;
  }
</style>
