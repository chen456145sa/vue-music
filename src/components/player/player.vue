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

          <div class="middle"
           @touchstart.prevent="midTouchStart"
           @touchmove.prevent="midTouchMove"
           @touchend="midTouchEnd">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="cdCls">
                  <img class="image" :src ="currentSong.photo">
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">
                  <p>{{playingLyric}}</p>
                </div>
              </div>
            </div>
            <Scroll class="middle-r" v-if="hasLyric" :arrayData="currentLyric && currentLyric.lines" ref="lyricScroll">
              <div class="lyric-wrapper">
                <div>
                  <p class="text" 
                  ref="lyricline"
                  v-for="(line, index) in currentLyric.lines" 
                  :key="index"
                  :class="{'current': currentNum == index}">{{line.txt}}</p>
                </div>
              </div>
            </Scroll>
          </div>

          <div class="bottom">
            <div class="progress-wrapper">
              <span class="time time-l">{{formatTime(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progressBar :duration='duration' :percent='currentTime' @change="change"></progressBar>
              </div>
              <span class="time time-r" v-if="duration">{{formatTime(duration)}}</span>
            </div>

            <div class="operators">
              <div class="icon i-left" @click="changeMode">
                <i :class="iconMode"></i>
              </div>
              <div class="icon i-left">
                <i class="el-icon-d-arrow-left" @click="prev" :class="songReady==false?'disable':''"></i>
              </div>
              <div class="icon i-center" >
                <i :class="playIcon" @click="togglePlaying"></i>
              </div>
              <div class="icon i-right" >
                <i class="el-icon-d-arrow-right" :class="songReady==false?'disable':''" @click="next"></i>
              </div>
              <div class="icon i-right" @click="toggleCollect(currentSong)">
                <i class="icon" :class="collectCls(currentSong)"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <transition name = 'mini'>
        <div class="mini-player" v-if="!fullScreen" @click="openFull">
          <div class="icon">
            <img  width="60" height="60" :src ="currentSong.photo">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.song_name">name</h2>
            <p class="desc" v-html="currentSong.singer_name">desc</p>
          </div>
          <div class="control" @click.stop="togglePlaying">
            <div class="control-wrapper">
              <i :class="playIcon" class="miniPlayIcon" ></i>
              <progressCircle class="progressCircle" :duration='duration' :currentTime='currentTime'></progressCircle>
            </div>
          </div>
          <div class="control" @click.stop="showPlayList">
            <i class="my-icon-playlist el-icon-s-fold"></i>
          </div>
        </div>
      </transition>
      <PlayList ref="PlayList"></PlayList>
      <audio :src ="currentSong.song_url" ref="audio" 
      @canplay="ready" @error="error" @timeupdate="updateTime" @ended="ended"></audio>
  </div>
</template>

<script>
import {mapGetters, mapActions,mapMutations} from 'vuex'
import progressBar from '@/components/base/progress-bar/progress-bar'
import progressCircle from '@/components/base/progress-bar/progress-circle'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'
import Lyric from 'lyric-parser'
import Scroll from '@/components/base/scroll/iscroll2'
import PlayList from '@/components/player/playList'
import {playModeMinxin} from 'common/js/minxin.js'
import {saveStorage,loadStorage,deleteStorage} from 'common/js/cache.js'

export default {
  mixins: [playModeMinxin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      duration: 0,
      currentLyric: null,
      playingLyric: '',
      currentNum: 0,
      hasLyric: false,
      currentShow: 'cd',
      favourArr: []
      
    }
  },
  components: {
    progressBar,
    progressCircle,
    Scroll,
    PlayList
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
        'currentIndex',
        'mode',
        'sequenceList',
        'disc'
    ]),
    playIcon() {
      if(!this.songReady) {
        if(this.playing) {
          return 'el-icon-video-play disable'
        }else {
          return 'el-icon-video-pause disable'
        }
      }else {
        return this.playing? 'el-icon-video-pause' : 'el-icon-video-play'
      }
      
    },
    cdCls() {
      return this.playing? 'play' : 'play pause'
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    // ...mapActions([
    //       'saveFavorite',
    //       'deleteFavorite'
    //   ]),
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    back() {
      this.setFullScreen(false)
    },
    openFull() {
      this.setFullScreen(true)
    },
    togglePlaying() {
      if(!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing);
      if(this.currentLyric) {
        this.currentLyric.togglePlay() //歌词暂停播放回调
      }
    },
    prev() {
      console.log('prev') 
      if(!this.songReady) {  //检查是否可以播放 再执行事件
        console.log('歌曲没准备好') 
        return
      }
      if(this.playList.length == 1) { //当列表只有一首歌时
        this.loop()
        this.setPlayingState(true)
        return
      }else {

        let index = this.currentIndex - 1;
        if(index == -1) {
          index = this.playList.length -1;
        }
        this.setCurrentIndex(index);
        if(!this.playing) {  //改变暂停时的状态
          this.togglePlaying()
        }
      }
      this.songReady = false;
    },
    next() {
      console.log('next') 
      if(!this.songReady) {
        console.log('歌曲没准备好') 
        return
      }
      if(this.playList.length == 1) { //当列表只有一首歌时
        this.loop()
        this.setPlayingState(true)
        return
      }else {
        let index = 0;
        if(this.mode == playMode.random) {
          index =  Math.floor( (Math.random()*this.playList.length))
        }else {
          index = this.currentIndex + 1;
        }
        
        if(index == this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if(!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false;
    },
    ready(e) {
      setTimeout(() => {
        this.duration = e.target.duration;
        // console.log(e)
        console.log('this.duration:'+this.duration)
      },500)
      
      
      this.songReady = true;
      //存储最近播放
      let obj = {
        id: this.currentSong.song_id,
        name: this.currentSong.song_name
      }
      saveStorage('last',obj);
    },
    error() {
      console.log('歌曲发生错误') 
      this.songReady = true;
    },
    ended() { //audio 结束时触发 判断是否是循环
      if(this.mode == playMode.loop) {
        this.loop()
      }else{
        this.next()
      }
    },
    loop() { //循环模式
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if(this.currentLyric) {
        this.currentLyric.seek(0);  //seek() 歌词移动到多少ms处
      }
    },
    updateTime(e) {
      // console.log(e) 事件对象
      this.currentTime = e.target.currentTime; //可读写属性
      // this.duration = e.target.duration;
      // console.log('this.duration:'+this.duration)
      // e.target.currentTime = this.changeVal;
    },
    formatTime(time) {  //格式化时间
      time = Math.floor(time);
      let minute = Math.floor(time/60).toString();
      let second = Math.floor(time%60);
      if(second.toString().length<2) {
        return `${minute}:0${second}`
      }else {
         return `${minute}:${second}`
      }
    },
    change(val) {  //滑动条拖拽事件
      this.$refs.audio.currentTime = val;
      console.log('val:'+val)
      if(!this.playing) {
        this.togglePlaying()
      }
      if(this.currentLyric) {
        this.currentLyric.seek(val * 1000); //移动到当前时间歌词
      }
    },
    changeMode() { //改变mode
      const mode = (this.mode + 1)%3;
      this.setPlayMode(mode);
      console.log(mode)
      let list = null ;

      if(mode == playMode.random) {
        console.log('随机模式')
        list = shuffle(this.sequenceList);   
      }else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list)
      // console.log('index:'+this.currentIndex)
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {  //随机模式重新设置index
      let index = list.findIndex((item) => {
        return item.song_id === this.currentSong.song_id
      })
      this.setCurrentIndex(index)
    },
    getSongLrcById() { //获取歌词
      let url =this.dataIp+'/singer/getSongLrcById/'+this.currentSong.song_id;
      this.$http.get(url)
      .then(result => {
          // console.log(result);
          // this.songList = result
          this.currentLyric = new Lyric(result.bodyText,this.handler);
          this.hasLyric = true;
          this.currentLyric.play();
          
          if(this.playing == false) {
            this.currentLyric.stop();
          }
      })
      .catch(err => {
        console.log(err);
        this.currentLyric = null;
        this.hasLyric = false;
        this.playingLyric = '';
        this.currentNum = 0;
      })
    },
    handler({lineNum, txt}) {  //play()时执行handler 回调函数
      // console.log('lineNum:'+lineNum)
      if(this.currentLyric) {
          this.currentNum = lineNum;
          if(lineNum >=5) {
            let tolyric = this.$refs.lyricline[lineNum - 5];
            this.$refs.lyricScroll.scrollToElement(tolyric, 1000)
          }else {
            this.$refs.lyricScroll.scrollToElement(this.$refs.lyricline[0], 1000)
          }
          // console.log(this.playingLyric)
          this.playingLyric = txt;
      }
      
    },
    midTouchStart(e) {
      // console.log(e)
      this.touch.initated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    midTouchMove(e) {
      if(!this.touch.initated) {
        return
      }
      let left = this.currentShow == 'cd'? 0 : -window.innerWidth;
      let offsetX = e.touches[0].pageX - this.touch.startX;
      let offsetY = e.touches[0].pageY - this.touch.startY;
      let offsetWidth =Math.min(0, Math.max(-window.innerWidth,offsetX + left)); //移动着最小是0  最大时-window.innerWidth
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // console.log(this.touch.percent)
      // console.log(offsetWidth) 
      this.$refs.lyricScroll.$el.style['transform'] = `translateX(${offsetWidth}px)`;
      this.$refs.lyricScroll.$el.style['transitionDuration'] = '0ms'
      this.$refs.middleL.style.opacity = 1 -  this.touch.percent;
      this.$refs.middleL.style['transitionDuration'] = '0ms'

    },
    midTouchEnd(e) {
      let offsetWidth = 0;
      let opacity = 0;
      if(this.currentShow == 'cd') {
        if(this.touch.percent > 0.15) {
          offsetWidth = -window.innerWidth;
          this.currentShow ='lyric';
          opacity = 0;
        }else {
          offsetWidth = 0;
          opacity = 1;
        }
      }else {
        if(this.touch.percent < 0.85) {
          offsetWidth = 0;
          this.currentShow ='cd';
          opacity = 1;
        }else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricScroll.$el.style['transform'] = `translateX(${offsetWidth}px)`;
      this.$refs.lyricScroll.$el.style['transitionDuration'] = '300ms'
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style['transitionDuration'] = '300ms'
      this.touch.initated = false;
    },
    showPlayList() { 
      this.$refs.PlayList.show();
    }
    // toggleCollect() { //收藏
    //   // this.favoriteList = loadStorage('favourate')
    //   for(let i =0;i<this.favoriteList.length;i++) {
    //     if(this.favoriteList[i].name == this.currentSong.song_name) { //如果有记录 就去除收藏
    //       // deleteStorage('favourate',this.favoriteList[i])
    //       this.deleteFavorite(this.favoriteList[i])
    //       // this.favoriteList = loadStorage('favourate')
    //       return
    //     }
    //   }
    //   let obj = {
    //     id: this.currentSong.song_id,
    //     name: this.currentSong.song_name
    //   }
    //   // saveStorage('favourate',obj)
    //   this.saveFavorite(obj)
    // }
    
  },
  watch: {
    currentSong(newSong,oldSong) {  
      console.log('点击却换了')
      console.log(newSong)
      console.log(oldSong)
      if(newSong == undefined) {
        //歌词对象重置
        this.currentLyric = null;
        this.hasLyric = false;
        this.playingLyric = '';
        this.currentNum = 0;
        return
      }
      if(oldSong && oldSong.song_id == newSong.song_id) {
        this.songReady = true;
        return
      }
      if(this.currentLyric) {
        this.currentLyric.stop();
      }

      this.getSongLrcById();
      setTimeout(()=>{
        this.duration = this.$refs.audio.duration; //获取时长
      },200)
      // if(!oldSong) {
      //   return
      // }
      
      this.$nextTick(()=> {
        this.$refs.audio.play();  //歌曲改变时播放
      })
      
    },
    playing(newPlaying) {   //播放暂停
      // console.log('newPlaying:'+newPlaying)
      let audio =null;
      setTimeout(()=> {
        audio = this.$refs.audio;
      },200)
      setTimeout(()=> {
        if(audio) {
          newPlaying ? audio.play() : audio.pause();
        }
      },400)
     
    },
    currentIndex(newIndex) {
      console.log("newIndex:"+newIndex)
    }
    // playList(newPlayList) {
    //   if(!newPlayList.length) {
    //     console.log('列表为空')
    //     // this.deleteList()
    //   }
    // }

    
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
  white-space: nowrap; /*这里可以配合子元素inline-block进行盒子不换行排列在一行*/
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
.playing-lyric-wrapper {
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 80%;
  overflow: hidden;
  text-align: center;
}
.playing-lyric {
  font-size: 20px;
  color: #fff;
  text-align: center;
}


.middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 102%;
  overflow: hidden;
}
.middle-r .lyric-wrapper {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center
}
.lyric-wrapper .text {
  line-height: 32px;
  color: #fff;
  font-size: 20px;
}
.lyric-wrapper .current {
  color: rgb(229, 253, 7);
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
/* .icon-loop,.icon-shuffle{
  font-size: 28px;
} */
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

.disable {
  pointer-events: none;
  color: rgba(122, 122, 122, 0.555);
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
  font-size: 44px;
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%,50%);
 
}
.control .my-icon-playlist {
  font-size: 30px;
}
.control .control-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
}
.control .progressCircle {
  position: absolute;
  bottom: 47%;
  left: 51%;
  transform: translate(-50%,50%)
}       
</style>