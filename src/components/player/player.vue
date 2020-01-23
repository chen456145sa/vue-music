<template>
  <div class="player" v-if="playList.length>0">
      <transition name = 'normal'>
        <div class="normal-player" v-show="fullScreen">
          <div class="background">
            <!-- <img width="200%" height="100%" :src="this.singer.img_url"> -->
          </div>

          <div class="top">
            <div class="back" @click="back">
              <i class="el-icon-bottom"></i>
            </div>
            <h1 class="title" v-html="currentSong.song_name">title</h1>
            <h2 class="subtitle" v-html="currentSong.singer_name">subtitle</h2>
          </div>

          <div class="middle">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdCls">
                  <img class="image" :src = "this.singer.img_url">
                </div>
              </div>
            </div>
          </div>

          <div class="bottom">
            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progressBar :duration='duration' :percent='currentTime' @change="change"></progressBar>
              </div>
              <span class="time time-r">{{formatTime(duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i class="icon-sequence el-icon-set-up"></i>
              </div>
              <div class="icon i-left">
                <i class="el-icon-d-arrow-left" @click="prev"></i>
              </div>
              <div class="icon i-center" >
                <i :class="playIcon" @click="togglePlaying"></i>
              </div>
              <div class="icon i-right" >
                <i class="el-icon-d-arrow-right" @click="next"></i>
              </div>
              <div class="icon i-right">
                <i class="icon icon-not-favorite el-icon-star-off"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <transition name = 'mini'>
        <div class="mini-player" v-show="!fullScreen" @click="openFull">
          <div class="icon">
            <img  width="60" height="60" :src = "this.singer.img_url">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.song_name">name</h2>
            <p class="desc" v-html="currentSong.singer_name">desc</p>
          </div>
          <div class="control">
            <i :class="playIcon" class="miniPlayIcon" @click.stop="togglePlaying"></i>
          </div>
          <div class="control">
            <i class="icon-playlist el-icon-s-fold"></i>
          </div>
        </div>
      </transition>
      <audio :src ="currentSong.song_url" ref="audio" 
      @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import progressBar from '@/components/base/progress-bar/progress-bar'
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      changeVal:0
    }
  },
  components: {
    progressBar
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters([
        'fullScreen',
        'playList',
        'singer',
        'currentSong',
        'playing',
        'currentIndex'
    ]),
    playIcon() {
      return this.playing? 'el-icon-video-pause' : 'el-icon-video-play'
    },
    cdCls() {
      return this.playing? 'play' : 'play pause'
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    back() {
      this.setFullScreen(false)
    },
    openFull() {
      this.setFullScreen(true)
    },
    togglePlaying() {
      this.setPlayingState(!this.playing)
    },
    prev() { 
      if(!this.songReady) {  //检查是否可以播放 再执行事件
        return
      }
      let index = this.currentIndex - 1;
      if(index == -1) {
        index = this.playList.length -1;
      }
      this.setCurrentIndex(index);
      if(!this.playing) {  //改变暂停时的状态
        this.togglePlaying()
      }
      this.songReady = false;
    },
    next() {
      if(!this.songReady) {
        return
      }
      let index = this.currentIndex + 1;
      if(index == this.playList.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if(!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      // console.log(e) 事件对象
      this.currentTime = e.target.currentTime; //可读写属性
      // e.target.currentTime = this.changeVal;
    },
    formatTime(time) {
      time = Math.floor(time);
      let minute = Math.floor(time/60);
      let second = Math.floor(time%60);
      if(second.toString().length<2) {
        return `${minute}:0${second}`
      }else {
         return `${minute}:${second}`
      }
    },
    change(val) {
      this.changeVal = val;
      this.$refs.audio.currentTime = val;
      console.log('val:'+val)
    }
    
   
  },
  watch: {
    currentSong() {
      setTimeout(()=>{
        this.duration = this.$refs.audio.duration; //获取时长
      },200)
      this.$nextTick(()=> {
        this.$refs.audio.play();  //歌曲改变时播放
      })
    },
    playing(newPlaying) {   //播放暂停
      console.log('newPlaying:'+newPlaying)
      let audio =null;
      setTimeout(()=> {
        audio = this.$refs.audio;
      },200)
      setTimeout(()=> {
        newPlaying ? audio.play() : audio.pause();
      },300)
    }
    
  }

}
</script>

<style scoped>
.player .normal-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: rgb(224, 224, 223);
}
.normal-player .background {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgb(58, 150, 255);
  z-index: -1;
  filter: blur(20px);
  opacity: 0.4;
}
/* 顶部 */
.top .back {
  font-size: 24px;
  color: rgb(255, 115, 34);
  display: inline-block;
  position: absolute;
  top: 13px;
  left: 13px;
}
.top .title {
  font-size: 26px;
  padding-top: 15px;
}
.top .subtitle {
  font-size: 18px;
  padding-top: 10px;
}
/* 中部 */
.middle {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  /* background-color: rgb(248, 56, 56); */
}
.middle .middle-l {
  display: inline-block;
  vertical-align: top;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 80%;
  /* background-color: #fff; */
}
.middle-l .cd-wrapper {
  position: absolute;
  left: 10%;
  top: 0;
  width: 80%;
  height: 100%;
  /* background-color: rgb(50, 231, 126); */
}
.middle-l .cd-wrapper .cd {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 10px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  overflow: hidden;
}
.cd-wrapper .cd .image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
/*底部*/
.bottom {
  position: absolute;
  bottom: 50px;
  width: 100%;
}
.bottom .operators {
  display: flex;
  align-items: center;
}
.operators .icon {
  flex: 1;
  font-size: 28px;
}
.icon ,.i-left {
  text-align: right;
}
.icon ,.i-right {
  text-align: left;
}
.progress-wrapper {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 10px 0;
}
.progress-wrapper .time {
  color: #fff;
  font-size: 16px;
  display: inline-block;
  flex: 1;
  line-height: 30px;
  /* padding: 0 10px; */

}
.progress-wrapper .time-l {
  text-align: left;
  padding-right: 5px;
}
.progress-wrapper .time-r {
  text-align: right;
  padding-left: 5px;
}
.progress-bar-wrapper {
  flex: 8;
}
/* 动画 */
.normal-enter-active {
  /* transition: all 0.5s; */
  animation: normal 0.5s;
  transform-origin: left top; 
}
.normal-leave-active {
  animation: normal 0.5s reverse;
  transform-origin: left top;
}
@keyframes normal {
  0% {
    opacity: 0;
    transform: rotateZ(-90deg)
  }
  100% {
    opacity: 1;
    transform: rotateZ(0deg)
  }
}
.play {
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
.mini-enter-active,.mini-leave-active {
  transition: all 0.5s;
}
.mini-enter,.mini-leave-to {
  transform: translateY(200px);
  opacity: 0;
}


/* 迷你播放器 */
.player .mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 80px;
  background: rgb(73, 118, 241);
}
.mini-player .icon {
  /* flex: 0 0 40px; */
  width: 60px;
  height: 60px;
  padding: 0 10px 0 20px;
}
.mini-player .icon img {
  border-radius: 50%;
}
.mini-player .text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  line-height: 26px;
  overflow: hidden;
  text-align: left;
  padding-left: 10px;
}       
.mini-player .text .name {
  font-size: 20px;
}
.mini-player .text .desc {
  font-size: 16px;
}
.mini-player .control {
  flex: 0 0 30px;
  width: 30px;
  padding: 0 10px;
}
.control .miniPlayIcon {
  font-size: 40px;
}
.control .icon-playlist {
  font-size: 30px;
}       
</style>