import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import {playMode} from 'common/js/config.js'
import {shuffle,findIndex} from 'common/js/util.js'
import {saveSearch,loadSearch,deleteSearch,clearSearch} from 'common/js/cache.js'
Vue.use(Vuex);

//获得本地存储购物车cart数据
// var car = JSON.parse(localStorage.getItem("cart"));

//定义属性
var state={
	singer: {},
	disc: {},
	playing: false,
	fullScreen: false,
	playList: [],
	sequenceList: [],
	mode: playMode.sequence,
	currentIndex: -1,
	cateSongs: {},
	clicked: false,
	searchHistory: loadSearch()
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
	disc: function(state) {
        return state.disc
	},
	cateSongs: function(state) {
        return state.cateSongs
	},
	clicked: function(state) {
        return state.clicked
	},
	searchHistory: function(state) {
        return state.searchHistory
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
        return state.playList[state.currentIndex]
	}
}

//定义actions ，要执行的方法  当要同时派发几个commit时调用
//$store.dispatch('increment')
const actions={
	selectPlay({commit,state},{list,index}) {
		commit(types.SET_PLAYING_STATE,true);
		commit(types.SET_FULL_SCREEN,true);
		commit(types.SET_SEQUENCE_LIST,list);
		//如果是随机播放 找到它在playlist里的对于歌曲
		if(state.mode == playMode.random) { 
			//let tlist = shuffle(list)
			let cindex = findIndex(state.playList,list[index])
			commit(types.SET_CURRENT_INDEX,cindex);
			console.log('依然是随机播放模式')
		}else {
			commit(types.SET_PLAYLIST,list);
			commit(types.SET_CURRENT_INDEX,index);
		}
		console.log('selectPlay')
	},
	randomPlay({commit,state},{list}) {
		commit(types.SET_PLAY_MODE,playMode.random);
		commit(types.SET_PLAYING_STATE,true);
		commit(types.SET_FULL_SCREEN,true);
		commit(types.SET_SEQUENCE_LIST,list);
		let tlist = shuffle(list)
		commit(types.SET_PLAYLIST,tlist);
		commit(types.SET_CURRENT_INDEX,0);
	},
	insertSong({commit,state},song) {
		let playList = state.playList.slice(0);
		let sequenceList = state.sequenceList.slice(0);
		let currentIndex = state.currentIndex;
		// console.log(playList)
		if(playList.length>0) {  //有播放列表时
			let currentSong = playList[currentIndex]
			let fpindex = findIndex(playList, song);
			if(fpindex > -1) { //有这首歌时 查看是否在播放 如果在播放就全屏
				if(currentSong.song_id == song.song_id) {
					commit(types.SET_FULL_SCREEN,true);
				}else {  //如果播放的不是这首个 则设置到这首歌的index
					currentIndex = findIndex(playList, song);
					commit(types.SET_FULL_SCREEN,true);
					commit(types.SET_CURRENT_INDEX,currentIndex);	
				}
			}else {  //如果播放列表没有 则加入到列表中 从新设置index
				playList.push(song);  
				currentIndex = findIndex(playList, song);
				commit(types.SET_PLAYLIST,playList);
				commit(types.SET_FULL_SCREEN,true);
				commit(types.SET_CURRENT_INDEX,currentIndex);
			}
		}else { //播放列表为空时 则加入到列表中
			playList.push(song);  
			commit(types.SET_PLAYLIST,playList);
			commit(types.SET_FULL_SCREEN,true);
			commit(types.SET_CURRENT_INDEX,0);
		}
		commit(types.SET_PLAYING_STATE,true);
		commit(types.SET_SEQUENCE_LIST,playList);
		// console.log(state.sequenceList)
	},
	saveSearchHistory({commit},query) {
		if(!query) {
			console.log('无效query')
			return
		}
		let history = saveSearch(query)
		console.log(history)
		commit(types.SET_SEARCH_HISTORY,history)
	},
	deleteSearchHistory({commit},query) {
		if(!query) {
			console.log('无效query')
			return
		}
		commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
	},
	clearSearchHistory({commit}) {
		commit(types.SET_SEARCH_HISTORY,clearSearch())
	}
}

//定义mutations 处理数据的改变
//$store.commit('increment') 也可以触发mutation的事件
const mutations={
    
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
	},
	[types.SET_DISC](state, disc) {
        state.disc = disc;
	},
	[types.SET_CATE_SONG](state, cateSongs) {
        state.cateSongs = cateSongs;
	},
	[types.SET_CLICK_FLAG](state, clicked) {
        state.clicked = clicked;
	},
	[types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history;
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
