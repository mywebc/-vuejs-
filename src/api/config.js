// 这些请求的数据固定的，我们把它封装起来
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}
export const options = {
  param: 'jsonpCallback'
}
export const ERR_OK = 0
