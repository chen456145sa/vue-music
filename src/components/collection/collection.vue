<template>
  <div class="collection" ref="collection">
    <MScroll :arrayData='temp' ref="scroll">
        <div class="top">
          <div class="tab-list">
            <span class="tab" :class="activeFlag == 1?'active':''" @click='changePane(1)'>最近播放</span>
            <span class="tab" :class="activeFlag == 2?'active':''" @click='changePane(2)'>我的收藏</span>
          </div>
        </div>

        <div >
          <div class="tab-container">
            <ul>
                <li v-for="(item,k) in temp" :key="k" class="item" @click.stop="playItem(item)" >
                  <span class="songName">{{item.name}}</span>
                  <span><i class="el-icon-close" @click.stop="clearItem(item)"></i></span>
                </li>
            </ul>
          </div>
        </div>

        <div>
          <Nofind :title="title" v-show="temp.length<=0"></Nofind>
        </div>
    </MScroll>

  </div>
</template>

<script>
import {saveStorage,loadStorage,deleteStorage,clearStorage} from 'common/js/cache.js'
import {mapGetters, mapActions,mapMutations} from 'vuex'
import Nofind from '@/components/base/nofind/nofind'
import MScroll from "@/components/base/scroll/iscroll2"
import {playListMinxin} from 'common/js/minxin'
export default {
  mixins:[playListMinxin],
  data() {
      return {
        lastArr: loadStorage('last'),
        temp: loadStorage('last'),
        activeFlag: 1,
        song: {},
        title: '暂无记录'
      }
  },
  activated() {
    this.lastArr = loadStorage('last');
    this.temp = this.lastArr;
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'currentIndex',
      'clicked',
      'currentSong'
    ])
  },
  components: {
    Nofind,
    MScroll
  },
  methods: {
    ...mapActions([
      'insertSong',
      'deleteFavorite'
    ]),
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
    }),
    handlePlayList(list) { //适配底部
      let bottom = list.length>0 ? '80px' : '';
      setTimeout(() => {
        if(this.clicked) {
          this.$refs.collection.style.bottom = bottom;
          this.$refs.scroll.refresh();
        }
        // console.log('singerlist')
      },1001)
    },
    changePane(val) {
      if(val == 1) {
        this.lastArr = loadStorage('last');
        this.temp = this.lastArr;
        this.activeFlag = 1;
      }else {
        // this.favourArr = loadStorage('favourate');
        // this.temp = this.favourArr;
        this.temp = this.favoriteList;
        this.activeFlag = 2;
      }
    },
    playItem(item) {
      //判断是否是当前歌曲
      if(item.name == this.currentSong.song_name) {
        console.log('歌曲相同，打开播放器')
        this.setFullScreen(true);
        return
      }
      //请求歌曲信息
      this.$http.get(this.dataIp+'/collection/'+item.id)
      .then(res => {
        this.song = res.body;
        console.log(this.song);
      })
      .catch(err => {
        console.log(err)
      })
      setTimeout(()=>{
        this.insertSong(this.song)
      },20)
      
    },
    clearItem(song) {
      if(this.activeFlag == 1) {

        this.lastArr = deleteStorage('last',song)
        this.temp =  this.lastArr;

      }else {
        
        this.deleteFavorite(song)
        // this.favourArr = loadStorage('favourate');
        // this.temp = this.favourArr;
        this.temp = this.favoriteList;
      }
    }

  },
  watch: {
    favoriteList() {
      this.temp = this.favoriteList;
      this.activeFlag = 2;
    },
    currentIndex() {
      // console.log('11111111')
      setTimeout(()=> {
        this.lastArr =  loadStorage('last');
        // console.log(this.lastArr)
        this.temp =  this.lastArr;
        this.activeFlag = 1;
      },1000)
      
    }
  }
}
</script>

<style scoped>
.collection {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.scroll {
  height: 100%;
  overflow: hidden;
}


.top {
  padding: 10px 0;
  font-size: 16px;
}
.tab-list {
  position: relative;
  display: inline-block;
  border: 1px solid rgb(43, 135, 255);
  padding: 8px 10px;
  border-radius: 10px;
}
.tab:first-child::after {
  content: '.';
  display: inline-block;
  position: absolute;
  top:0;
  left: 50%;
  transform: translateX(-50%);
  height: 33px;
  width: 1px;
  background-color: rgb(43, 135, 255);

}
.tab {
  padding: 0 3px;
}
.active {
  color: rgb(33, 136, 253);
}
.tab-container {
  width: 90%;
  padding-top: 10px;
  margin-left: 5%;
  text-align: left;
}
.item {
  display: flex;
  font-size: 16px;
  padding: 10px 5px;
  margin: 3px 0;
  border: 1px dashed #ccc;
  color: rgb(68, 68, 68);
  transition: all 0.5s;
}
.item .songName {
  flex: 1;
}


</style>