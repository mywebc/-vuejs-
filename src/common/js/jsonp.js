 // 很多地方都要用到jsonp,在这里我们做一个封装
 import originJsonp from 'jsonp'
 export default function jsonp(url, data, option) {
   url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
   return new Promise((resolve, reject) => {
     originJsonp(url, option, (err, data) => {
       if (!err) {
         resolve(data)
       } else {
         reject(err)
       }
     })
   })
 }
 // 定义拼接字符串的函数
 export function param (data) {
   let url = ''
   // 遍历data数组，用&一个一个拼接起来
   for (var k in data) {
     // 如果是undefined就设为空，否则取出来
     let value = data[k] !== undefined ? data[k] : ''
     url += '&' + k + '=' + encodeURIComponent(value)
    // url += ` &${k}=${encodeURIComponent(value)}`
   }
   // substring中只写一个参数的话，第二个参数就是到最后
   return url ? url.substring(1) : ''
 }
