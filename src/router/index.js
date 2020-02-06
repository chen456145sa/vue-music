import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Rank from '@/components/rank/rank'
import Recommend from '@/components/recommend/recommend'
import Search from '@/components/search/search'
import Singer from '@/components/singer/singer'
import SingerDetail from '@/components/singer/singerDetail'
import Disc from '@/components/disc/disc'
Vue.use(Router)
//vue-router3.0错误解决
const routerPush = Router.prototype.push  
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path:':id',
          component: Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path:':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
