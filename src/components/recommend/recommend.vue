<template>
<div class="recommend">
  <MScroll class="recommend-content" ref="scrollView" :arrayData="listInfo">
    <div>
      <m-Swipe></m-Swipe>
      <div class="recommend-List" v-if="listInfo.length">
        <h1 class="list-title">歌单推荐</h1>
            <ul>
            <li class="item" v-for="(item,k) in listInfo" :key="k">
              <div class="left_icon">
                <img v-lazy="item.img_url" alt="" @load="loadImage">
              </div>
              <div class="right_text">
                <h2>{{item.creator.name}}</h2>
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
</div>
</template>

<script>
import MSwipe from "@/components/swipe/swipe"
// import MScroll from '@/components/base/scroll'
// import MIscroll from '@/components/base/scroll/iscroll'
import MScroll from "@/components/base/scroll/iscroll2"
import Loading from '@/components/base/Loading/Loading'
export default {
  data () {
    return {
      listInfo: []
    }
  },
  created() {
      this.getSongList();
      // var _self = this;
      // setTimeout(function(){
      //   _self.getSongList();
      // },1000)
  },
  watch: {
    
  },
  methods: {
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
    width: 25%;
  }
  .item .left_icon img {
    width: 100%;
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
</style>