<template>
  <div class="search-list">
    <ul>
      <li class="item" v-for="(item, index) in data" :key="index" @click="setInput(item)">
        <span class="query">{{item}}</span>
        <span class="el-icon-close icon" @click.stop="deleteItem(item)"></span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
      data: {
          type: Array,
          default: []
      }
  },
  methods: {
      setInput(item) {
        this.$emit('setQuery',item);
      },
      deleteItem(item) {
        this.$emit('deleteSearch',item);
      }
  }
}
</script>

<style scoped>
.search-list {
    width: 100%;
}
.search-list .item {
    display: flex;
    align-items: center;
    width: 90%;
    height: 40px;
    margin-left: 5%;
    text-align: left;
    overflow: hidden;
}
.search-list .query {
    flex: 1;
}


</style>