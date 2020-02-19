<template>
  <div class="searchbox">
     <el-input ref="input" type="text" prefix-icon="el-icon-search" v-model="query" placeholder="请输入内容" clearable></el-input>
  </div>
</template>

<script>
import {debounce} from 'common/js/util.js'
export default {
  data() {
      return {
          query: '',
      }
  },
  mounted() {
      console.log(this.$refs.input)
  },
  activated() {
      this.query = '';
  },
  created() {
      this.$watch("query", debounce((newquery)=> {
          this.$emit("query", newquery)
      }, 200)) 
  },
  methods: {
      delQuery() {
          this.query = '';
      },
      setQuery(query) {
          this.query = query
      },
      blur() {  
          this.$refs.input.blur()
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