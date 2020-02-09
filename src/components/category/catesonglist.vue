<template>
  <transition name="xxx">
    <div v-if="songList.length>0" class="cateContainer">
      <musicList :songList = "songList" :bgimg = "bgimg" :title = "title"></musicList>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from "vuex"
import musicList from '@/components/base/music-list/music-list'

export default {
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters([
        'cateSongs'
    ]),
    bgimg() {
      return this.cateSongs.img_url
    },
    title() {
      return this.cateSongs.title
    },
  },
  created() {
    setTimeout(() => {  
      console.log(this)
      this.songList = this.cateSongs.songs;
    },1000)
  },
  activated() {
    this.songList = this.cateSongs.songs;  
  },
  components: {
    musicList
  },
  methods: {
    back() {
      this.$router.back();
    },
  }
}
</script>

<style scoped>
.cateContainer {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgb(207, 207, 207);
}
.xxx-enter-active,.xxx-leave-active {
  transition: all 1s;
}
.xxx-enter,
.xxx-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
