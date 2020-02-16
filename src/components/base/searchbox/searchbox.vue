<template>
  <div class="searchbox">
     <el-input type="text" prefix-icon="el-icon-search" v-model="query" placeholder="请输入内容" clearable></el-input>
  </div>
</template>

<script>

export default {
  data() {
      return {
          query: '',
      }
  },
  activated() {
      this.query = '';
  },
  created() {
      this.$watch("query", (newquery)=> {
          this.$emit("query", newquery)
      })
  },
  methods: {
      delQuery() {
          this.query = '';
      },
      setQuery(query) {
          this.query = query
      }
  },
  watch: {

  }

}
</script>

<style scoped>
.searchbox {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 90%;
    /* height: 25px; */
    /* margin-left: 10%; */
    margin-top: 15px;
    margin-left: 5%;
}


</style>