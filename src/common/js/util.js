// 经典的洗牌函数
// 获取min和max中间的数包括上限
function getRandomInt (min, max) {
  // 加一是为了保证取到上限
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  // 克隆一份数组，slice返回数组
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    // 把第一个数据存起来
    let t = _arr[i]
    // 用随机数据替换第一个位置
    _arr[i] = _arr[j]
    // 之前存的放到随机数据的位置上
    _arr[j] = t
  }
  return _arr
}

// 搜索节流
// 每次我们输入时都会发送请求，我们让他延迟
// 输入一次延迟执行，再输入一次再延迟执行（清空上一次的计时器），
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
