<template>
<transition name='list'>
    <div class="playList" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
        <div class="list-top">
            <i class="icon el-icon-set-up"></i>
            <span class="modeText">顺序模式</span>
            <span class="clear"><i class="el-icon-delete icon"></i></span>
        </div>
        <Scroll class="list-content">
            <ul>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                 <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                 <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
                <li class="item">
                    <span class="name">name</span>
                    <span class="like"><i class="el-icon-star-off"></i></span>
                    <span class="delete"><i class="el-icon-close"></i></span>
                </li>
            </ul>
        </Scroll>
        <div class="list-add">
            <div class="add">
                <i class="el-icon-plus"></i>
                <span class="text">添加歌曲到队列</span>
            </div>
        </div>
        <div class="list-close" @click.stop="hide">
            <span>关闭</span>
        </div>
    </div>
    </div>
</transition>
</template>

<script>
import Scroll from '@/components/base/scroll/iscroll2'
export default {
  props: {
      text: {
          type: String,
          default: ''
      }
  },
  data() {
      return {
          showFlag: false
      }
  },
  mounted() {

  },
  methods: {
      show() {
          this.showFlag = true;
      },
      hide() {
          this.showFlag = false;
      }
  },
  components: {
      Scroll
  }
}
</script>

<style scoped>
.playList {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: rgba(167, 167, 167, 0.253);
}
/* 动画 */
.list-enter-active,.list-leave-active {
    transition: all 0.5s;
}
.list-enter, .list-leave-to {
    opacity: 0;
}
.list-enter  .list-wrapper, 
.list-leave-to  .list-wrapper {
    transform: translate3d(0, 100%, 0);
}
.list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.list-top {
    display: flex;
    align-items: center;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(204, 204, 204, 0.541);
}
.list-top .modeText {
    flex: 1;
}
.list-top .icon {
    font-size: 20px;
    margin-right: 10px;
}

.list-content {
    max-height: 240px;
    overflow: hidden;
}
.list-content .item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    padding: 0 25px 0 16px;
    text-align: left;
}
.list-content .item .name {
    flex: 1;
}
.list-content .item .like {
    margin-right: 10px
}

.list-add .add {
    padding: 7px 8px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 15px;
}
.list-close {
    line-height: 50px;
    background-color: rgb(15, 150, 204);
    color: #fff;
    font-size: 16px;
}


</style>