<template>
<div class="recommend" ref="recommend">
  <MScroll class="recommend-content" ref="scrollView" :arrayData="listInfo">
    <div>
      <m-Swipe></m-Swipe>
      <div class="recommend-banner">
        <h1 class="list-title">歌单推荐</h1>
        <span class="change" @click="changeRec"><i class="el-icon-refresh"></i> 换一换</span>
        <ul v-if="recArray.length">
          <li class="rec-item" v-for="(item,key) in recArray" :key="key">
            <img v-lazy="item.img_url" alt="zjl" >
            <div>
              <h1>{{item.title}}</h1>
              <p>{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="recommend-List" v-if="listInfo.length">
        <h1 class="list-title">歌单广场</h1>
            <ul>
            <li class="item" v-for="(item,k) in listInfo" :key="k" @click="setItem(item)">
              <div class="left_icon">
                <img v-lazy="item.img_url" alt="" @load="loadImage">
                <span>{{item.topTag}}</span>
              </div>
              <div class="right_text">
                <h2>{{item.title}}</h2>
                <p>{{item.dissname}}</p>
              </div>
            </li>
          </ul>
      </div>
      <div class="loading-container" v-show="!listInfo.length">
        <Loading></Loading>
      </div>
    </div>
  </MScroll>
  <router-view></router-view>
</div>
</template>

<script>
import MSwipe from "@/components/swipe/swipe"
// import MScroll from '@/components/base/scroll'
// import MIscroll from '@/components/base/scroll/iscroll'
import MScroll from "@/components/base/scroll/iscroll2"
import Loading from '@/components/base/Loading/Loading'
import {playListMinxin} from 'common/js/minxin'
import {saveStorage,loadStorage,deleteStorage,clearStorage} from 'common/js/cache.js'
import {mapGetters, mapMutations} from 'vuex'
export default {
  mixins: [playListMinxin],
  data () {
    return {
      listInfo: [],
      recArray: []
    }
  },
  computed: {
    ...mapGetters([
      'disc',
      'clicked'
    ])
  },
  created() {
      this.getSongList();
      // var _self = this;
      // setTimeout(function(){
      //   _self.getSongList();
      // },1000)
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    setItem(item) {  //路由
      this.$router.push({  
        path: "/recommend/"+item.id
      })
      this.setDisc(item);
      // console.log(this.disc)
      this.saveTag(item)  //储存tag
    },
    handlePlayList(list) { //适配底部
      let bottom = list.length>0 ? '80px' : '';
      setTimeout(() => {
        if(this.clicked) {
          this.$refs.recommend.style.bottom = bottom;
          this.$refs.scrollView.refresh();
        }
        // console.log('singerlist')
      },1001)
    },
    getSongList() {
      this.$http.get('http://localhost:8888/recommend/getSongList')
      .then(res => {
        this.listInfo = res.body.list;
        //console.log(this.listInfo);
      })
      .catch(err => {
        console.log(err)
      })
    },
    loadImage() {  //当图片加载时重新刷新scroll
      if(!this.checkLoading) {
        this.$refs.scrollView.refresh();
        //console.log(111)
        this.checkLoading = true;
      }
    },
    saveTag(item) {
      let obj = {
        id: item.id,
        tag: item.tag
      }
      saveStorage('lovetag',obj)
    },
    changeRec() {
      let loveTag = loadStorage('lovetag')
      let arr = []
      let maxIndex = 0;
      let moreTag = '';
      let secondTag = '';
      //逻辑一 先找出最多出现的tag 取该tag的歌单  
      //逻辑二 随机从lovetag里取一个或多个tag 取该tag组的歌单
      for(let i =0; i<loveTag.length; i++) {
          let flag = true;
          let obj = {}
          obj['id'] = loveTag[i].id;
          obj['val'] = 1;
          obj['tag'] =  loveTag[i].tag;
          if(arr.length>0) {
            for(let j =0; j<arr.length; j++) {
              if(arr[j].tag == loveTag[i].tag) {
                 arr[j].val +=1;
                 flag = false
              }
            }
          }
          if(flag) {
           arr.push(obj) 
          } 
      }
      for(let i =0; i<arr.length-1; i++) {
        if(arr[i+1].val<arr[i].val) {
          maxIndex = i
        }else {
          maxIndex = i + 1
        }
      }
      moreTag = arr[maxIndex].tag;
      arr.splice(maxIndex,1)
      secondTag =  arr[Math.floor(Math.random()*arr.length)].tag 
      // console.log(secondTag)
      // console.log(arr)
      // console.log(maxIndex)
      // console.log(moreTag)
      //发送请求 请求歌单
      this.searchRec('http://localhost:8888/recommend/getRecList', 3, [moreTag,secondTag])
      .then((res)=> {
        console.log(res)
        if(res) {
          this.recArray = res
        }
      })


    },
    searchRec(url, number, tagGroup) {
        let data = {
            number: number,
            tagGroup: tagGroup
        }
        return new Promise((resolve,reject)=> {
            this.$http.jsonp(url,{params: data})
            .then(result => {
                //console.log(result);
                // this.results = result.body;
                // console.log(this.results)
                resolve( result.body)
            })
            .catch(err => {
                // console.log(err);
                reject(err)
            })
        })
       
    }
  },
  components: {
    MSwipe,
    MScroll,
    Loading
  }
}
</script>

<style scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }



  .list-title {
    font-size: 16px;
    font-weight: 700;
    color: rgb(41, 40, 40);
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .item {
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .item .left_icon {
    position: relative;
    width: 25%;
  }
  .item .left_icon img {
    width: 100%;
  }
   .item .left_icon span {
     display: block;
     position:absolute;
     top: 3px;
     left: 3px;
     padding: 2px 3px;
     font-size: 10px;
     background-color: rgba(0, 0, 0, 0.329);
     color: #fff;
     border-radius: 5px;
   }
  .item .right_text {
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
  }
  .item .right_text h2 {
    padding-top: 10px;
    padding-left: 15px;
    font-size: 14px;
    font-weight: 500;
  }
  .item .right_text p {
    padding-top: 20px;
    padding-left: 15px;
    padding-right: 15px;
    line-height: 16px;
    font-size: 12px;
    font-weight: 500;
    color: rgb(92, 92, 92);
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 100%;
    /* transform: translateY(-50%); */
  }
  .recommend-banner {
    position: relative;
  }
  .recommend-banner ul {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    
  }
  .rec-item {
    box-sizing: border-box;
    background-color: rgba(235, 235, 235, 0.555);
    margin: 5px 0px;
    box-shadow: 1px 1px 1px rgb(148, 148, 148);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    overflow: hidden;
    text-align: left;
    width: 32%;
  }
  .rec-item img {
    border-radius: 6px;
    min-height: 120px;
    max-width: 120px;
    width: 100%;
    margin-bottom: 5px;
  }
  .rec-item p {
    padding-left: 2px;
    font-size: 12px;
    line-height: 14px;
  }
  .change {
    display: inline-block;
    position: absolute;
    right: 6px;
    top: 40px;
  }
</style>