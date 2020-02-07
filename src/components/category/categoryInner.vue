<template>
  <div class="categoryInner">
      <MScroll class="wrapper">
        <div>
           <el-card :body-style="{ padding: '0px' }" v-for="(item, k) in cateList" :key="k">
                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                <div style="padding: 14px;">
                    <span>{{item.title}}</span>
                    <div class="bottom clearfix">
                    <time class="time">{{item.disc}}</time>
                    </div>
                </div>
            </el-card> 
        </div>
      </MScroll>
  </div>
</template>

<script>
import MScroll from "@/components/base/scroll/iscroll2"
export default {
  props: {
  },
  data() {
    return {
        cateList: []
    }
  },
  created() {
    //   console.log(this.$route.params)
    this.getSongListByTag();
  },
  mounted() {

  },
  components: {
      MScroll
  },
  methods: {
      getSongListByTag() {
        let url ='http://localhost:8888/category/getCategoryByTag/'+this.$route.params.tag;
        this.$http.jsonp(url)
        .then(result => {
            // console.log(result);
            // this.cateArr = result.body.list 
            // console.log(this.cateArr)
            this.cateList = result.body;
            console.log(this.cateList)
        })
        .catch(err => {
            console.log(err);
        })
      }
  },
  watch: {

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
</style>