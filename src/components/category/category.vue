<template>
  <div class="category">
    <MScroll class="wrapper">
      <div>
        <h1 class="good-cate">精选分类</h1>
        <ul class="cate-container">
          <li class="item" v-for="(item,key) in cateArr" :key="key" @click="findTag(item.tag)">
            <img :src="item.img_url" class="left-img">
            <span class="right">{{item.title}}</span>
          </li>
        </ul>
        <div class="clearfix"></div>
        <h1 class="good-cate">分类标签</h1>
        <div>
          <table class="cate-table">
            <tr >
              <td rowspan="2"><span>心情</span></td><td><span>伤感</span></td><td><span>安静</span></td><td><span>治愈</span></td>
            </tr>
            <tr>
            <td><span>轻松</span></td><td><span>激情</span></td><td><span>甜蜜</span></td>
            </tr>
            <tr>
              <td><span>开心</span></td><td><span>想念</span></td><td><span>治疗</span></td>
            </tr>
          </table>
          <table class="cate-table">
            <tr >
              <td rowspan="2"><span>场景</span></td><td><span>运动</span></td><td><span>睡前</span></td><td><span>店铺</span></td>
            </tr>
            <tr>
            <td><span>游戏</span></td><td><span>k歌</span></td><td><span>开车</span></td>
            </tr>
            <tr>
              <td><span>咖啡馆</span></td><td><span>校园</span></td><td><span>蹦迪</span></td><td><span>工作</span></td>
            </tr>
          </table>
          <table class="cate-table">
            <tr >
              <td rowspan="2"><span>年代</span></td><td><span>70后</span></td><td><span>80后</span></td><td><span>90后</span></td>
            </tr>
            <tr>
            <td><span>00后</span></td>
            </tr>
          </table>
        </div>
      </div>
    </MScroll>
    <router-view></router-view>
  </div>

</template>

<script>
import MScroll from "@/components/base/scroll/iscroll2"
export default {
  created() {
    this.getCategory();
  },
  data () {
    return {
      cateArr: []
    }
  },
  components: {
    MScroll
  },
  methods: {
    getCategory() {
      let url ='http://localhost:8888/category/getCategory';
      this.$http.jsonp(url)
      .then(result => {
          //console.log(result);
          this.cateArr = result.body.list 
          console.log(this.cateArr)   
      })
      .catch(err => {
        console.log(err);
      })
    },
    findTag(tag) {
      console.log(tag)
      this.$router.push({
        path: '/category/'+tag
      })
    }
  }
}
</script>

<style scoped>
  .category {
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
  .good-cate {
    text-align: left;
    border-left: 2px solid rgb(44, 130, 228);
    padding: 7.5px 7.5px;
    font-weight: 600;
    color: rgb(44, 130, 228);
  }
  .cate-container {

  }
  .item {
    box-sizing: border-box;
    width: 48%; 
    float: left;
    background-color: rgb(255, 255, 255);
    margin: 5px 1%;
    padding: 5px 6px;
    text-align: left;
    border-radius: 5px;
  }
  .item .left-img {
    width: 70px;
    border-radius: 50%;
  }
  .right {
    padding-left: 20%;
  }
  .clearfix {
    clear: both;
  }

  .cate-table {
    border-collapse: collapse;
    width: 80%;
    margin-left: 3%;
    margin-top: 10px;
  }
  .cate-table td {
    text-align: center;
    background-color: rgb(253, 252, 231);
    border: 1px solid rgba(233, 231, 231, 0.788);
  }
  .cate-table td span {
    display: inline-block;
    margin: 10px 5px;
    padding: 5px 5px;
    
  }
</style>