<template>
  <div class="confirm">
    <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="60%"
    append-to-body
    center>
    <span>{{text}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doMethod(callback)">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    //   dialogVisible: {
    //       type: Boolean,
    //       default: false
    //   },
      text: {
          type: String,
          default: ''
      },
      callback: {
          type: String,
          default: ''
      }
  },
  data() {
      return {
          dialogVisible:false
      }
  },
  mounted() {

  },
  methods: {
      setDialogVisible(val) {
          this.dialogVisible = val;
      },
      clearHistory(obj) {
          obj.dialogVisible = false;
          obj.$emit('clearHistory')
      },
      clearList(obj) {
          obj.dialogVisible = false;
          obj.$emit('clearPlayList')
      },
      doMethod(fn) {  //执行方法
        let _self = this;
        let methods = this.$options.methods
        methods[fn](_self)
      }
  }
}
</script>

<style scoped>


</style>