<template>
  <div class="collection">
    <div class="top">
      <div class="tab-list">
        <span class="tab" :class="activeFlag == 1?'active':''" @click='changePane(1)'>最近播放</span>
        <span class="tab" :class="activeFlag == 2?'active':''" @click='changePane(2)'>我的收藏</span>
      </div>
      
    </div>
    <div>
      <div class="tab-container">
        <ul>
            <li v-for="(item,k) in temp" :key="k" class="item" @click.stop="playItem(item)" >
              <span class="songName">{{item.name}}</span>
              <span><i class="el-icon-close" @click.stop="clearItem(item)"></i></span>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {loadStorage} from 'common/js/cache.js'
import {mapGetters, mapActions,mapMutations} from 'vuex'
export default {
 
  data() {
      return {
        lastArr: loadStorage('last'),
        favourArr: loadStorage('favourate'),
        temp: loadStorage('last'),
        activeFlag: 1,
        song: {}
      }
  },
  activated() {
    this.lastArr = loadStorage('last');
    this.favourArr = loadStorage('favourate');
  },
  computed: {
    ...mapGetters([
      'favoriteList'
    ])
  },
  methods: {
    ...mapActions([
      'insertSong',
      'deleteFavorite'
    ]),
    changePane(val) {
      if(val == 1) {
        this.temp = this.lastArr;
        this.activeFlag = 1;
      }else {
        this.favourArr = loadStorage('favourate');
        this.temp = this.favourArr;
        this.activeFlag = 2;
      }
    },
    playItem(item) {
      //请求歌曲信息
      this.$http.get('http://localhost:8888/collection/'+item.id)
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
        console.log(1111)
      }else {
        this.deleteFavorite(song)
        this.favourArr = loadStorage('favourate');
      }
    }

  }
}
</script>

<style scoped>
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