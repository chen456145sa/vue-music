<template>
  <div class="categoryInner" ref="categoryInner">
      <MScroll class="wrapper" ref="innerScroll">
        <div v-if="cateList.length>0">
           <div v-for="(item, k) in cateList" :key="k" class="card" @click.prevent="setItem(item)">
                <img :src="item.img_url" class="image">
                <div class="disc-container">
                    <span class="title">{{item.title}}</span>
                    <div class="bottom clearfix">
                    <span class="time">{{item.disc}}</span>
                    <span class="creator">{{item.creator}}</span>
                    </div>
                </div>
            </div> 
        </div>
      </MScroll>
      <router-view class="cateList"></router-view>
  </div>
</template>

<script>
import MScroll from "@/components/base/scroll/iscroll2"
import {mapMutations, mapGetters} from "vuex"
import {playListMinxin} from 'common/js/minxin'
export default {
  mixins: [playListMinxin],
  data() {
    return {
        cateList: [],
        tag: ''
    }
  },
  created() {
    this.tag = this.$route.params.tag
  },
  computed: {
    ...mapGetters([
      'cateSongs',
      'clicked'
    ])
  },
  mounted() {
    this.getSongListByTag();
  },
  activated() {
  },
  components: {
      MScroll
  },
  methods: {
      ...mapMutations({
        setCateSong: 'SET_CATE_SONG'
      }),
      handlePlayList(list) {
        let bottom = list.length>0 ? '80px' : '';
        setTimeout(() => {
          if(this.clicked) {
            this.$refs.categoryInner.style.bottom = bottom;
            this.$refs.innerScroll.refresh();
          }
        },1001)
      },
      getSongListByTag() {
        let url =this.dataIp+'/category/getCategoryByTag/'+this.$route.params.tag;
        this.$http.jsonp(url)
        .then(result => {
            this.cateList = result.body;
        })
        .catch(err => {
            console.log(err);
        })
      },
      setItem(item) {
        console.log('setItem')
        console.log(this.tag)
        console.log(item)
        this.$router.push({  //编程路由
          path: '/category/'+this.tag+'/'+item.id
        })
        this.setCateSong(item)
      }

  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      if(this.$route.params.tag) {
         this.getSongListByTag();
        //  console.log(this.$route.params.tag)
      }
  }
  }
}
</script>

<style scoped>

.categoryInner {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    background-color: rgba(233, 231, 231, 0.788);
}
.wrapper {
    height: 100%;
    overflow: hidden;
}
.card {
  width: 48%;
  overflow: hidden;
  float: left;
  margin-bottom: 6px;
  margin-left: 1%;
  border-radius: 5px;
  box-shadow: 1px 1px 1px #ccc;
}
.image {
  width: 100%;
}
.title {
  display: inline-block;
  padding-top: 12px;
  padding-left: 8px;
  font-weight: 500;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif
}
.disc-container {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  text-align: left;
}
.time {
  display: inline-block;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 9px;
  font-weight: 500;
  font-size: 13px;
  color: rgb(141, 141, 141);
}
.creator {
  position: absolute;
  right: 6px;
  bottom: 8px;
  vertical-align: bottom;
  color: rgb(141, 141, 141);
}
</style>