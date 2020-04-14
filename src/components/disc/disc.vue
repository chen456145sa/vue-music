<template>
  <div class="disc" v-if="songs.length>0">
      <transition name = "slide">
          <musicList :songList='songs' :bgimg='bgimg' :title='title'></musicList>
      </transition>
  </div>
</template>

<script>
import musicList from '@/components/base/music-list/music-list'
import {mapGetters} from 'vuex'
export default {
  created() {
    this.getSongList()
  },
  data() {
    return {
        songs: []
    }
  },
  computed: {
    ...mapGetters([
        'disc'
    ]),
    bgimg() {
      if(this.disc.id !== 'undefinded') {
        return this.disc.img_url
      }else {
        return ''
      }
        
    },
    title() {
      if(this.disc.id !== 'undefinded') {
        return this.disc.title
      }else {
        return ''
      }
        
    }
  }, 
  mounted() {
    //   console.log(this.$route.params)
    if(!this.disc.img_url) {  //刷新问题
      this.$router.push({  //编程路由
        path: "/recommend/"
      })
      console.log('刷新路由')
      return
    }
    // console.log(this.disc)
  },
  components: {
    musicList
  },
  methods: {
    getSongList() {

        let url =this.dataIp+'/recommend/getRecSongsById/'+ this.$route.params.id
        if(this.disc.rec) {
          url = this.dataIp+'/recommend/getRecListSong/'+ this.$route.params.id
        }
        this.$http.jsonp(url)
        .then(result => {
            // console.log(result);
            if(this.disc.rec) {
              this.songs = result.body[0].songs
            }else {
              this.songs = result.body.songs  
            }
            
              
        })
        .catch(err => {
            console.log(err);
        })
    }
  }
}
</script>

<style scoped>


/* 过度类动画 */
.slider-enter-active,.slider-leave-active {
transition: all 0.5s;
}
.slider-enter,
.slider-leave-to {
transform: translateX(100%);
opacity: 0;
}
</style>