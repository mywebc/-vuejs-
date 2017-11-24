 import 'babel-polyfill'
 import Vue from 'vue'
 import App from './App'
 import fastclick from 'fastclick'
 import router from './router'
 import 'common/stylus/index.styl'
 import VueLazyLoad from 'vue-lazyload'

 fastclick.attach(document.body)
// 在这里声明使用
 Vue.use(VueLazyLoad, {
   loading: require('common/image/default.png')
 })
/* eslint-disable no-new */
 new Vue({
   el: '#app',
   render: h => h(App),
   router
 })
