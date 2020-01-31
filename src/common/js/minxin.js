/*1-minxins可以包含任意组件对象的选项(例如:methods, mounted等钩子函数, 
    components, directives等等),
  2-当组件使用minxins对象时, minxins对象的选项, 将被混合进组件的选项
  3-如果minxins对象的选项是钩子函数(created, mounted等)将会先于组件的钩子函数执行（minxin优先）
  4-如果minxins对象的选项为对象(如methods, directives,components), 则会合并为同意对象, 
  如果键值发生冲突, 则会使用组件的键值对（组件优先）
*/
import {mapGetters} from 'vuex'
export const playListMinxin = {
    mounted() {  //会混入到组件中 优先与组件执行
        this.handlePlayList(this.playList)
    },
    activated() { //keep-alive 组件切换时触发
        this.handlePlayList(this.playList)
    },
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    methods: {  //由于优先级问题 在组件里mounted时如果组件自己没有定义handlePlayList 则会调用minxin里的函数 也就是说组件必须定义该函数 
        handlePlayList() { 
            throw new Error('组件未定义handlePlayList函数') 
        }
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        } 
    }
}