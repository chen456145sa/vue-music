<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to='/recommend'>
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to='/singer'>
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to='/category'>
      <span class="tab-link">分类</span>
    </router-link>
    <router-link tag="div" class="tab-item" to='/search'>
      <span class="tab-link">搜索</span>
    </router-link>
    <router-link tag="div" class="tab-item" to='/collection'>
      <span class="tab-link">收藏</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style scoped>
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: 14px;

  }
  .tab-item {
    flex: 1;
    text-align: center;

  }
  .tab-link {
    padding-bottom: 5px;
    color: rgb(70, 112, 252);
  }
  .router-link-active .tab-link {
    border-bottom: 2px solid #ccc; 
  }
</style>