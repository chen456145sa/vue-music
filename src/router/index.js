import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/Header'
import Category from '@/components/category/category'
import CategoryInner from '@/components/category/categoryInner'
import Catesonglist from '@/components/category/catesonglist'
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
      path: '/category',
      component: Category
    },
    {
      path: '/category/:tag',
      component: CategoryInner
    },
    {
      path: '/category/:tag/:id',
      component: Catesonglist,
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/search/singer/:id',
      component: SingerDetail
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
