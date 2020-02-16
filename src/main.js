import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/css/reset.css'
//解决移动端 1px 边框的问题
import './common/css/border.css'

// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Slider,Progress,Card,Input} from 'element-ui';

import fastclick from 'fastclick'
import VueResource from 'vue-resource'

import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'

import VueLazyload from 'vue-lazyload'

import pinyin from "chinese-to-pinyin"

import store from "./store/index"

Vue.prototype.pinyin = pinyin;
//console.log(pinyin)

Vue.config.productionTip = false;
//取消300ms的延迟
fastclick.attach(document.body);

Vue.use(VueResource);

Vue.use(IScrollView, IScroll)

Vue.use(VueLazyload, {
  loading: require('common/images/load.jpg')
})

// Vue.use(ElementUI);
Vue.component(Slider.name, Slider);
Vue.component(Progress.name, Progress);
Vue.component(Card.name, Card);
Vue.component(Input.name, Input);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
