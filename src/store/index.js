import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import {playMode} from 'common/js/config.js'
Vue.use(Vuex);

//获得本地存储购物车cart数据
// var car = JSON.parse(localStorage.getItem("cart"));

//定义属性
var state={
	singer: {},
	playing: false,
	fullScreen: false,
	playList: [],
	sequenceList: [],
	mode: playMode.sequence,
	currentIndex: -1
}

//定义getters 访问数据的第二种方式 （不可以在这里改变数据）可以认为是 store 的计算属性
//Getter 接受 state 作为其第一个参数
//$store.getters.user  
var getters={	
	// cartNum: function(state) {               //获得总数
	// 	var c = 0;
	// 	state.cart.forEach(item => {
	// 		c += item.count
	// 	})
	// 	return c
    // }
    singer: function(state) {
        return state.singer
	},
	playing: function(state) {
        return state.playing
	},
	fullScreen: function(state) {
        return state.fullScreen
	},
	playList: function(state) {
        return state.playList
	},
	sequenceList: function(state) {
        return state.sequenceList
	},
	mode: function(state) {
        return state.mode
	},
	currentIndex: function(state) {
        return state.currentIndex
	},
	currentSong: function(state) {
        return state.plaayList[state.currentIndex]
	}
}

//定义actions ，要执行的方法  当要同时派发几个commit时调用
//$store.dispatch('increment')
const actions={
//	increment(context,state){
//		console.log(context);
//		context.commit('increment'); //提交一个名为 increment的变化
//	}
	selectPlay({commit,state},{list,index}) {
		commit(types.SET_PLAYING_STATE,true);
		commit(types.SET_FULL_SCREEN,true);
		commit(types.SET_SEQUENCE_LIST,list);
		commit(types.SET_PLAYLIST,list);
		commit(types.SET_CURRENT_INDEX,index);
		console.log('selectPlay')
		console.log(state.fullScreen)
	}
}

//定义mutations 处理数据的改变
//$store.commit('increment') 也可以触发mutation的事件
const mutations={
    
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag;
	},
	[types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag;
	},
	[types.SET_PLAYLIST](state, list) {
        state.playList = list;
	},
	[types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list;
	},
	[types.SET_PLAY_MODE](state, mode) {
        state.mode = mode;
	},
	[types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index;
    }
	// addToCart(state,goods){                        //将商品添加到购物车
	// 	//如果商品存在 则数量相加
	// 	var flag = true;
	// 	state.cart.some(item => {
	// 		if(item.id == goods.id) {
	// 			item.count+= goods.count;
	// 			flag = false;
	// 			return true
	// 		}
	// 	})
	// 	if(flag) {
	// 		state.cart.push(goods);
	// 	}
	// 	//将购物车的数据存储到本地
	// 	localStorage.setItem("cart", JSON.stringify(state.cart))
	// }

}

//创建store对象，
const store=new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})

//导出store对象
export default store;
