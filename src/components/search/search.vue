<template>
  <div class="search">
    <SearchBox ref="searchbox" @query="getQuery"></SearchBox>
    <div class="hotSearch" v-show="!query">
      <h1 class="title">热门搜索</h1>
      <ul class="hotlist">
        <li v-for="item in hotkey" :key="item.k" @click="setInput(item)">
          <span>{{item.k}}</span>
        </li>
      </ul>
    </div>
    <div class="clearfix"></div>
    <div class="search-history" v-if="!query">
      <div>
        <h1 class="title">搜索历史</h1>
      </div>
      <searchList :data='searchHistory' @setQuery='setQuery' @deleteSearch='deleteSearch'></searchList>
    </div>
    <div v-show="query" class="suggest-container">
      <Suggest :query="query" @beforeScroll ='blurInput' @saveHistory='saveHistory'></Suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '@/components/base/searchbox/searchbox'
import Suggest from '@/components/base/suggest/suggest'
import searchList from '@/components/search/search-list'
import {mapActions,mapGetters} from 'vuex'
export default {
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  created() {
    this.getHotKey();
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    getHotKey() {
      let url ='http://localhost:8888/search/getHotKey';
      this.$http.jsonp(url)
      .then(result => {
          //console.log(result);
          this.hotkey = result.body.hotkeyList;
          // console.log(this.hotkey)    
      })
      .catch(err => {
        console.log(err);
      })
    },
    setInput(item) {
      this.$refs.searchbox.setQuery(item.k)
      this.query = item.k;
    },
    getQuery(val) {
      // console.log(val)
      this.query = val;
    },
    blurInput() {  //失去焦点
      this.$refs.searchbox.blur()
    },
    saveHistory() {  //存储搜索词
      // console.log('saveHistory')
      this.saveSearchHistory(this.query);
      console.log( this.searchHistory)
    },

    setQuery(item) {
      this.$refs.searchbox.setQuery(item)
      this.query = item;
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item)
    }
  },
  components: {
    SearchBox,
    Suggest,
    searchList
  }
}
</script>

<style scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
.hotSearch {
  padding-top: 10px;
  text-align: left;
  width: 100%;
}
.title {
  text-align: left;
  border-left: 2px solid rgb(44, 130, 228);
  padding: 7.5px 7.5px;
  font-weight: 600;
  color: rgb(44, 130, 228);
}
.hotlist {
  /* height: 100px; */
  padding-top: 5px;
  width: 100%;
}
.hotlist li {
  float: left;
  padding: 5px 10px;
  margin: 5px 5px;
  background-color: rgb(206, 206, 206);
  border-radius: 3px;
  text-align: center;
  color: rgb(3, 58, 209)
}
.clearfix {
  clear: both;
}
.suggest-container {
  height: 91%;
}
</style>