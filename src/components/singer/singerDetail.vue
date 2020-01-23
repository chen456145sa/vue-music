<template>
  <transition name="slider">
    <!-- <div class='singerDetail' v-if="show">
      <div class="top" :style="bgimg" ref="top">
        <div class="header">
          <span class="break el-icon-back" @click="back"></span>
          <h1 class="name">{{this.singer.name}}</h1>
          <a href="javascript:;" class="randomBtn" ref="randomBtn">随机播放</a>
        </div>
      </div>
      <div class="bg-layer" ref="layer"></div>
      <MScroll :arrayData = "songList" :probeType =3 :listenScroll=true 
      class="songscroll" ref="songscroll" @scroll="scroll">
         <div class="listwrapper">
            <songListView :songs = "songList"></songListView>
        </div>
      </MScroll>
      <div class="loading-container" v-show="!songList.length">
        <Loading></Loading>
      </div>
    </div> -->
    <musicList :songList = "songList" :bgimg = "bgimg" :title = "title"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from "vuex"
import MScroll from "@/components/base/scroll/iscroll2"
import songListView from "@/components/base/listview/songListView"
import Loading from '@/components/base/Loading/Loading'
import musicList from '@/components/base/music-list/music-list'

export default {
  data () {
    return {
      songList: []
      // scrollY: 0,
      // show: false,
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    bgimg() {
      // return `background-image:url(${this.singer.img_url})`
      return this.singer.img_url
    },
    title() {
      return this.singer.name
    },
  },
  created() {
    // setTimeout(() => {  //解决enter动画效果不显示问题
    //   this.show = true
    // },20)
    setTimeout(() => {  
      this.getSingerDetail()
    },1000)
    
  },
  mounted() {
    // var _self = this;
    // setTimeout(()=> {
    //   // this.$refs.songscroll.refresh();
    //   //遮罩层最大滚动高度
    //   this.maxHeight = - this.$refs.top.clientHeight + 40;
    //   console.log( this.maxHeight)
    // },3000);
    
  },
  components: {
    MScroll,
    songListView,
    Loading,
    musicList
  },
  methods: {
    getSingerDetail() {
      if(!this.singer.id) {
        this.$router.push({  //编程路由
          path: "/singer/"
        })
        return
      }
      let url ='http://localhost:8888/singer/getSongListbyId/'+this.singer.id;
      this.$http.jsonp(url)
      .then(result => {
          //console.log(result);
          this.songList = result.body    
      })
      .catch(err => {
        console.log(err);
      })
    }
    // scroll(pos) {
    //   this.scrollY = pos.y;
    // },
    // back() {
    //   this.$router.back();
    // }
  },
  watch: {
    // scrollY(newY) { //设置遮罩层的滚动
    //   let translateY = Math.max( - this.$refs.top.clientHeight + 40 ,newY);
    //   let zIndex = 0;
    //   let scale = 1;
      
      
    //   if(newY <= 0) {  //移动遮罩
    //     this.$refs.layer.style['transform'] = `translateY(${translateY}px)`;
    //     this.$refs.layer.style['webkitTransform'] = `translateY(${translateY}px)`;
    //     //通过设置背景图zindex 和 高度 实现顶部遮挡
    //     if(newY < this.maxHeight) {
    //       zIndex = 10;
    //       this.$refs.top.style.zIndex = zIndex;
    //       this.$refs.top.style.paddingTop = 0;
    //       this.$refs.top.style.height = 40 + "px";
    //       //隐藏按钮
    //       this.$refs.randomBtn.style.display = "none";
    //     }else {
    //       zIndex = 0;
    //       this.$refs.top.style.zIndex = zIndex;
    //       this.$refs.top.style.paddingTop = "60%";
    //       this.$refs.top.style.height = 0 + "px"; 
    //       //显示按钮
    //       this.$refs.randomBtn.style.display = "block";
    //     }
    //   }
    //   if( newY > 0) {  //缩放图片
    //     const percent = Math.abs(newY/ this.$refs.top.clientHeight)
    //     // console.log(percent)
    //     scale = 1+ percent;
    //     zIndex = 10;
    //     this.$refs.top.style.zIndex = zIndex;
    //     this.$refs.top.style['transform'] = `scale(${scale})`;
    //     this.$refs.top.style['webkitTransform'] = `scale(${scale})`;
    //   }
    // }

  }
}
</script>

<style scoped>
  .singerDetail{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgb(207, 207, 207);
  }
  /* 过度类动画 */
  .slider-enter-active,.slider-leave-active {
    transition: all 0.5s;
  }
  .slider-enter,
  .slider-leave-to {
    transform: translateX(100%);
    opacity: 0;
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
</style>
