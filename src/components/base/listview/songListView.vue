<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="content">
          <h2 class="name">{{song.song_name}}</h2>
          <p class="singer">{{song.singer_name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
      songs: {
          type: Array,
          default: []
      }
  },
  mounted() {

  },
  methods: {
    selectItem(song,index) {
      this.$emit('select', song, index);
      // console.log('第一个index: '+index)
    }
  }
}
</script>

<style scoped>
.song-list {
    width: 100%;
}
.song-list .item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
}
.song-list .content {
  flex: 1;
  line-height: 20px;
  overflow: hidden;
  text-align: left;
  padding-left: 20px;
}
.song-list .content .name {
  padding-bottom: 8px;
}
.song-list .content .singer {
  font-size: 12px;
  color: rgb(117, 117, 117);
}

</style>