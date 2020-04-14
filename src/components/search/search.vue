<template>
  <div class="search">
    <SearchBox ref="searchbox" @query="getQuery"></SearchBox>
    <MScroll class="searchScroll" :arrayData='shortcut' v-show="!query" ref="searchScroll">
      <div class="scrollWrapper" ref="scrollWrapper">
        <div class="hotSearch" v-show="!query">
          <h1 class="title">热门搜索</h1>
          <ul class="hotlist">
            <li v-for="item in hotkey" :key="item.k" @click="setInput(item)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="clearfix"></div>
        <div class="search-history" v-if="!query&&searchHistory.length>0" ref="shistory">
            <div class="search-title">
              <h1 class="title">搜索历史</h1>
              <span class="icon el-icon-delete" @click="openConfirm"></span>
            </div>
            <searchList :historyArray='searchHistory' @setQuery='setQuery' @deleteSearch='deleteSearch'></searchList>
        </div>
      </div>
    </MScroll>

    <div v-show="query" class="suggest-container" ref="sugContainer">
      <Suggest :query="query" @beforeScroll ='blurInput' @saveHistory='saveHistory' ref="suggest"></Suggest>
    </div>
    <div class="ConfirmBox">
      <ConfirmBox :text ='confirmText' :callback='callback' ref="confirm" @clearHistory='clearHistory'></ConfirmBox>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>
import SearchBox from '@/components/base/searchbox/searchbox'
import ConfirmBox from '@/components/base/confirm/confirm'
import Suggest from '@/components/base/suggest/suggest'
import searchList from '@/components/search/search-list'
import MScroll from "@/components/base/scroll/iscroll2"
import {mapActions,mapGetters} from 'vuex'
import {playListMinxin} from 'common/js/minxin'
export default {
  data () {
    return {
      callback: 'clearHistory',
      hotkey: [],
      query: '',
      confirmText: '确定要删除历史记录吗？',
      searchListflag: false   //底部适配flag
    }
  },
  mixins:[playListMinxin],
  created() {
    this.getHotKey();
  },
  activated() {
    // console.log('activated')
    this.setInput('')
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'clicked'
    ]),
    shortcut() {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    handlePlayList(list) {
      let bottom = list.length>0 ? '80px' : '';
      setTimeout(() => {
        if(this.clicked) {
          if(this.$refs.searchScroll!=undefined) {
            this.$refs.searchScroll.$el.style.bottom = bottom;
            this.$refs.searchScroll.refresh();
          }
        }
      },1001)
    },
    getHotKey() {
      let url =this.dataIp+'/search/getHotKey';
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
    saveHistory(name) {  //存储搜索词

      this.setQuery(name)
      this.saveSearchHistory(this.query);
      this.setQuery('')  //储存完后再次清空搜索框
    },

    setQuery(item) {
      this.$refs.searchbox.setQuery(item)
      this.query = item;
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item)
    },
    clearHistory() {
      this.clearSearchHistory()
    },
    openConfirm() {
      this.$refs.confirm.setDialogVisible(true);
    }
  },
  watch: {
    query(newQuery) {  //suggest适配底部
      if(this.searchListflag == true) {
        return
      }
      let bottom = '80px';
      if(this.clicked && !this.searchListflag) {
        if(this.$refs.sugContainer!=undefined) {
          this.$refs.sugContainer.style.bottom = bottom;
          this.$refs.suggest.refresh();
        }
        console.log('fff')
        this.searchListflag = true
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    searchList,
    ConfirmBox,
    MScroll
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
  position: fixed;
  width: 100%;
  top: 150px;
  bottom: 0;
  /* height: 90%; */
  overflow: hidden;
  /* height: 91%; */
}

.search-history .search-title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  text-align: left;
  overflow: hidden;

}
.search-history .search-title .title {
  flex: 1;
}
.search-history .search-title .icon {
  margin-right: 5%;
}

.searchScroll {
  position: fixed;
  width: 100%;
  top: 150px;
  bottom: 0;
  /* height: 90%; */
  overflow: hidden;
}
</style>