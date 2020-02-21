<template>
  <div class="suggest" v-if="results.song">
      <MScroll class="container" 
      :arrayData ='results.song' 
      :pullup='pullup' 
      @scrollToEnd="searchMore"
      :beforeScroll ='beforeScroll'
      @beforeScroll = 'listbeforeScroll'
      ref="suggestScroll">
        <ul class="suggest-list">
            <div>
                <li v-for="(singer,k) in results.singer" :key="k" @click="selectSinger(singer)">
                    <span class="icon el-icon-user"></span>
                    <p>{{singer.singer_name}}</p>
                </li>
            </div>
            <div>
                <li v-for="(song,k) in results.song" :key="k" @click="selectSong(song)">
                    <span class="icon el-icon-headset"></span>
                    <p>{{song.song_name}} — {{song.singer_name}}</p>
                </li>
            </div>
            <Loading v-if="hasmore" :title="title"></Loading>
        </ul>
        <div class="no-find">
            <Nofind v-if="!results.song.length"></Nofind>
        </div>
      </MScroll>
  </div>
</template>

<script>
// import {jsonp} from 'common/js/jsonp'
import MScroll from "@/components/base/scroll/iscroll2"
import Loading from '@/components/base/Loading/Loading'
import Nofind from '@/components/base/nofind/nofind'
import {mapActions,mapMutations} from 'vuex'
export default {
  props: {
      query: {
          type: String,
          default: ''
      }
  },
  data() {
      return {
          results: [],
          page: 1,
          perpage: 15,
          pullup: true,
          beforeScroll: true,
          hasmore: true,
          title: ''
      }
  },
  mounted() {

  },
  components: {
      MScroll,
      Loading,
      Nofind
  },
  methods: {
    ...mapActions([
        'insertSong'
    ]),
    ...mapMutations({
        setSinger: 'SET_SINGER'
    }),
    search(newQuery, page, perpage) {
        if(!newQuery) {
            return
        }
        this.hasmore =true;
        let data = {
            page: page,
            perpage: perpage,
            key: newQuery
        }
        let url ='http://localhost:8888/search/searchList2/'
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
       
    },
    sear(key) {  //测试
        let data = {
            is_xml: 0,
            key: key,
            g_tk: 5381,
            loginUin: 1208000603,
            hostUin: 0,
            format: 'json',
            notice: 0,
            platform: 'yqq.json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            format: 'jsonp',
            needNewCode: 0
        }
        let header = {
            origin: 'https://y.qq.com',
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        };
        // referer: 'https://y.qq.com/portal/search.html',
        let url2 = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?';
        this.$http.jsonp(url2,{params: data, headers: header,jsonp: 'jsonpCallback'})
        .then(result => {
            console.log(result);
            // this.results = result.body;
            // console.log(this.results)    
        })
        .catch(err => {
            console.log(err);
        })
    },
    searchMore() {
        if(!this.hasmore) {
            return
        }
        this.$refs.suggestScroll.scrollTo(0,0); //重置到顶部
        this.page+=1;
        this.search(this.query,this.page, this.perpage).then(res => {
            this.results.song = this.results.song.concat(res.song);
            if(res.song.length < this.perpage) {
                this.hasmore =false;
            }else {
                this.hasmore =true;
            } 
            console.log(res)
            console.log(this.results.song)
        })
        .catch(err => {
            console.log(err);
        })
    },
    selectSinger(singer) {  //路由到歌手页面
        //转化成一致的数据格式
        let obj = {
            id: singer.singer_id,
            name: singer.singer_name,
            img_url: singer.singer_pic
        }
        this.setSinger(obj);  
        this.$router.push({  //编程路由
            path: "/search/singer/"+obj.id
        })
        
        this.setHistory();
    },
    selectSong(song){   //设置播放列表 打开播放器
        this.insertSong(song);
        
        this.setHistory();
    },
    listbeforeScroll() {  //滚动之前收起模拟键盘
        this.$emit('beforeScroll')
    },
    setHistory() { //派发事件
        this.$emit('saveHistory')
    }  
  },
  watch: {
      query(newQuery) {
          if(!newQuery) {
              return
          }
          this.page = 1;
          this.search(newQuery,this.page, this.perpage).then(res => {
              this.results = res;
              if(res.song.length < this.perpage) {
                  this.hasmore =false;
              }else {
                  this.hasmore =true;
              }  
          }).catch(err => {
              console.log(err)
          })
        //   this.sear(newQuery)
      }
  }

}
</script>

<style scoped>
.suggest {
    box-sizing: border-box;
    height: 100%;
    width: 90%;
    margin-left: 5%;
    text-align: left;
    background-color: rgb(241, 241, 241);
    overflow: hidden;
}
.container {
    height: 100%;
}
.suggest-list li {
    padding: 10px 0;
    color: rgb(65, 165, 231);
    border-bottom: 2px solid #fff;
    padding-left: 5px;
}
.suggest-list li p {
    display: inline-block;
    padding-left: 5px;
}
.no-find {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
}

</style>