// 这里封装一些对DOM操作的函数
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split('')
  newClass.push(className)
  el.className = newClass.join('')
}

//  先判断是否有className
export function hasClass (el, className) {
  let reg = new RegExp('(^|//s)' + className + '(//s|$)')
  return reg.test(el.className)
}

// 在这里封装一个获取data-index 的方法
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name, val)
  }
}
