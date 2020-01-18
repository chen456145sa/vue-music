# vue-music
> A Vue.js project

##1.初始化项目
使用全局安装的vue-cil 快速构建项目目录结构和webpack配置
vue init webpack vue-music
npm install
修改config 里的index.js  修改build的属性为：
assetsPublicPath: './', 打包时路径不对所以要改

##2.构建首页
#2.1 初始化页面
-添加viewport 
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">

-重置样式 reset.css,
import './common/css/reset.css'

-解决移动端 1px 边框的问题
添加 border.css 
import './common/css/border.css'

-解决移动端 click 事件 300ms 延迟
安装fastclick ,并绑定

#2.2