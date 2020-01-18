<template>
  <div class="player" v-show="playList.length>0">

      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" src="">
        </div>

        <div class="top">
          <div class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title"></h1>
          <h2 class="subtitle"></h2>
        </div>

        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" >
                <img class="image" >
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i ></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" >
              <i ></i>
            </div>
            <div class="icon i-right" >
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="mini-player" v-show="!fullScreen">
        <div class="icon">
          <img  width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name"></h2>
          <p class="desc"></p>
        </div>
        <div class="control">
          
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: {

  },
  mounted() {

  },
  computed: {
      ...mapGetters([
          'fullScreen',
          'playList'
      ])
  },
  methods: {
 
  },
  watch: {

  }

}
</script>

<style scoped>
.player .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: rgb(204, 204, 204);
}
.player .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: rgb(73, 118, 241);
}
</style>