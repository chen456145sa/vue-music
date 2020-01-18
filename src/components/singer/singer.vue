<template>
  <div class="singer" v-if="singerList.length">
    <MScroll ref="singerscroll" :listenScroll=true :probeType =3 class="wrapper" @scroll="scroll">
      <ul>
        <li v-for="group in singerList" :key="group.title" class="group" ref="group" >
          <h2 class="group_title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.item" :key="item.id" class="item_self" @click="selectSinger(item)">
              <img :src="item.img_url" class="avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </MScroll>
    <div class="list-aside">
      <ul>
        <li v-for="(item, key) in shortcutList" :key="key" class="aside_item"
        :class="{'active': currentIndex === key}" 
        @touchstart.stop.prevent="onShortcutTouchStart" :data-index="key"
        @touchmove.stop.prevent="onShortcutTouchMove">
          {{item}}
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// import MScroll from "@/components/base/scroll/iscroll"
import MScroll from "@/components/base/scroll/iscroll2"
import {mapMutations} from "vuex"
export default {
  data () {
    return {
      singerList:[],
      scrollY: -1,
      currentIndex: 0
    }
  },
  created() {
    this.touch = {};
    this.GroupListHeight = [];
  },
  mounted() {
    //this.test();
    this.getSingerList();
    var _self = this;
    setTimeout(()=> {
      _self.$refs.singerscroll.refresh();
      _self.getGroupListHeight();
    },2000)
  },
  computed: {
    shortcutList() {  //侧边栏数组
      let List = [];
      this.singerList.forEach(function(item) {
        List.push(item.title)
      })
      return List
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    test() {  //插件测试
      console.log(this.pinyin('周'));
    },
    getSingerList() {  //获取歌手列表
      this.$http.get('http://localhost:8888/singer/getSingerList')
      .then(result => {
          //console.log(result.body);
          this.singerList = result.body.singerlist;	
          this.singerList = this.mormalizeList(this.singerList);
          //console.log(this.singerList)
          
      })
      .catch(err => {
        console.log(err);
      })
    },
    mormalizeList(list) {  //初始化数据
      //整理数据
      let obj = {};
      list.forEach((item,index) => {
        //转化首字母
        var str = this.pinyin(item.singer_name.charAt(0)).charAt(0).toUpperCase();
        if(!obj[str]) {
          obj[str] = {
            title: str,
            item: []
          };
        }
        obj[str].item.push({
          id: item.singer_id,
          name: item.singer_name,
          img_url: item.singer_pic
        })
      })
      //console.log(obj);
      //转成有序数组
      let arr = [];
      for (let key in obj) {
        arr.push(obj[key]);
      }
      arr.sort(function(a, b) {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      //console.log(arr)
      return arr;
    },
    onShortcutTouchStart(e) {  //绑定侧边栏点击跳转事件
      let index = parseInt(e.target.getAttribute("data-index")); //字符串类型 需要转换
      //滚动到某个元素
      this.$refs.singerscroll.scrollToElement(this.$refs.group[index],0);

      //记录手指初始位置,索引
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.index = index;
      //设置currentIndex 与 scrollY
      this.currentIndex = index; 
      this.scrollY = -this.GroupListHeight[index];

    },
    onShortcutTouchMove(e) {  //绑定滚动跳转事件
      let firstTouch = e.touches[0]; //第一个手指
      this.touch.y2 = firstTouch.pageY;
      //计算偏差的index  23.6是li的高度  | 0 与向下取整一样
      let offset = (this.touch.y2-this.touch.y1)/23.6 | 0;
      //新index
      let newIndex = this.touch.index + offset;
      if(newIndex <= 0) {
        newIndex = 0;
      }
      if(newIndex >= this.shortcutList.length-1) {
        newIndex = this.shortcutList.length - 1
      }
      // console.log(newIndex)
      this.$refs.singerscroll.scrollToElement(this.$refs.group[newIndex],0);
      //设置currentIndex 与 scrollY
      this.currentIndex = newIndex;
      this.scrollY = -this.GroupListHeight[newIndex];
      // console.log("currentIndex"+":"+this.currentIndex)
    },
    getGroupListHeight() {  //得到每个组的高度
      this.GroupListHeight = [];
      if(this.$refs.group) {
        let h =0;
        this.GroupListHeight.push(h);
        this.$refs.group.forEach((item) => {
          // this.GroupListHeight.push(item.offsetTop)
          h += item.clientHeight;
          this.GroupListHeight.push(h)
        })
      }
      //console.log(this.GroupListHeight)
      
    },
    scroll(pos) {
      // console.log(pos)
      this.scrollY = pos.y;
    },
    selectSinger(item) {  //设置歌手对象
      this.$router.push({  //编程路由
        path: "/singer/"+item.id
      })
      this.setSinger(item);
      console.log(this.$store.getters.singer)
    }
  },
  watch: {
    scrollY(newY) {  //监测Y值 的区间
      let GroupListHeight = this.GroupListHeight;
      // console.log(newY)
      if(newY>0) {
        this.currentIndex = 0;
        return
      }
      for (let i = 0; i < GroupListHeight.length-1; i++) {
        let h1 = GroupListHeight[i];
        let h2 = GroupListHeight[i + 1];
        if (-newY > h1 && -newY < h2) {  
          this.currentIndex = i;
          // console.log(1)
          return
        }
        // this.currentIndex = 0;
      }
    }
    // ,
    // currentIndex(newC) {
    //   console.log("newC"+":"+newC)
    // }
  },
  components: {
    MScroll
  }
}
</script>

<style scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
  .wrapper {
    height: 100%;
    overflow: hidden;
  }
  .group {
    padding-top: 20px;
  }
  .group_title {
    /* height: 20px;
    width: 20px; */
    padding: 5px 8px;
    background-color: rgb(0, 158, 250);
    border-radius: 3px;
    /* opacity: 0.5; */
    display: inline-block;
    color: #fff;
  }
  .item_self {
     display: flex;
     justify-content: space-between;
     align-items: center;
     position: relative;
     padding-left: 8%;
     padding-right: 8%;
     padding-bottom: 15px;
     padding-top: 15px;
  }
  .item_self .avatar {
    width: 25%;
    border-radius: 50%;
    display: block
  }
  .item_self .name {
    margin-right: 8%;
  }
  /* 侧边栏 */
  .list-aside {
    position: fixed;
    top: 50%;
    transform: translateY(-43%);
    right: 10px;
  }
  .list-aside .aside_item {
    padding: 5px 0;
    /* padding-bottom: 6px; */
  }

  /* 区间激活状态 改变侧边栏*/
  .list-aside .active {
    color: rgb(27, 102, 240);
  }

</style>