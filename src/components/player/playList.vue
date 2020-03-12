<template>
<transition name='list'>
    <div class="playList" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
        <div class="list-top">
            <i class="icon el-icon-set-up" @click.stop="changeMode"></i>
            <span class="modeText" v-html="modecls">顺序模式</span>
            <span class="clear"><i class="el-icon-delete icon"></i></span>
        </div>
        <Scroll class="list-content" ref="listScroll">
            <ul ref="liList">
                <li class="item" v-for="(item,k) in playList" :key="k" @click.stop="selectItem(k)" >
                    <span class="name" :class="currentIndex==k? 'current' : ''">{{item.song_name}}</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
            </ul>
        </Scroll>
        <div class="list-add">
            <div class="add">
                <i class="el-icon-plus"></i>
                <span class="text">添加歌曲到队列</span>
            </div>
        </div>
        <div class="list-close" @click.stop="hide">
            <span>关闭</span>
        </div>
    </div>
    </div>
</transition>
</template>

<script>
import Scroll from '@/components/base/scroll/iscroll2'
import {mapGetters,mapMutations} from 'vuex'
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'
export default {
  props: {
      text: {
          type: String,
          default: ''
      }
  },
  data() {
      return {
          showFlag: false
      }
  },
  computed: {
      ...mapGetters([
          'sequenceList',
          'mode',
          'currentIndex',
          'playList',
          'currentSong',
          'playing'
      ]),
      modecls() {
          if(this.mode == 0) {
                return '顺序模式'
          }
          if(this.mode == 1) {
                return '循环模式'
          }
          return '随机模式'
      }
  },
  methods: {
      ...mapMutations({
          setPlayMode: 'SET_PLAY_MODE',
          setCurrentIndex: 'SET_CURRENT_INDEX',
          setPlayList: 'SET_PLAYLIST',
          setPlayingState: 'SET_PLAYING_STATE'
      }),
      show() {
          this.showFlag = true;
          setTimeout(() => {
              this.scrollToCurrent()
            //   this.$refs.listScroll.refresh();
          },5000)
          
      },
      hide() {
          this.showFlag = false;
        //   this.$refs.listScroll.scrollTo(0,0,0)
      },
      changeMode() {  //改变模式
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
      selectItem(k) {  //设置歌曲
          this.setCurrentIndex(k);
          this.setPlayingState(true);
      },
      scrollToCurrent() {  //将当前播放歌曲放到列表第一位
          if(this.showFlag == false) {
              return
          }
          let index = this.playList.findIndex((item)=> {
              return item.song_id == this.currentSong.song_id
          })
          console.log('index: '+index)
          console.log(this.$refs.liList)
        //   console.log(this.$refs.listScroll)
          this.$refs.listScroll.scrollToElement(this.$refs.liList.children[index])
      }
  },
  watch: {
      currentSong() {
          this.scrollToCurrent()
      }
  },
  components: {
      Scroll
  }
}
</script>

<style scoped>
.current {
    color: rgb(28, 166, 230);
}
.playList {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(167, 167, 167, 0.253);
}
/* 动画 */
.list-enter-active,.list-leave-active {
    transition: all 0.5s;
}
.list-enter, .list-leave-to {
    opacity: 0;
}
.list-enter  .list-wrapper, 
.list-leave-to  .list-wrapper {
    transform: translate3d(0, 100%, 0);
}
.list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.list-top {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(204, 204, 204, 0.541);
}
.list-top .modeText {
    flex: 1;
}
.list-top .icon {
    font-size: 20px;
    margin-right: 10px;
}

.list-content {
    max-height: 240px;
    overflow: hidden;
}
.list-content .item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    padding: 0 25px 0 16px;
    text-align: left;
}
.list-content .item .name {
    flex: 1;
}
.list-content .item .like {
    margin-right: 10px
}

.list-add .add {
    padding: 7px 8px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 15px;
}
.list-close {
    line-height: 50px;
    background-color: rgb(15, 150, 204);
    color: #fff;
    font-size: 16px;
}


</style>