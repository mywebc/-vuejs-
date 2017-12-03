// 这里操作主要和localStorage相关的东西
// 我们直接操作storage比较麻烦，这里用到第三方库good-storage
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVOURITE_KEY = '__favourite__'
const FAVOURITE_MAX_LENGTH = 200

// 这个函数是用来把查询数据放到一个数组
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 如果数组中有这条数据，且是第一个那就什么都不做
  if (index === 0) {
    return
  }
  // 如果数组中的这条数据不在第一个那就删除他
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 并且在开头插入
  arr.unshift(val)
  // 判断长度
  if (maxLen && arr.length > maxLen) {
    // 如果长度大于15位，删除最后一个
    arr.pop()
  }
}

// 删除数组中的一些值
function deleteFormArray (arr, compare) {
  const index = arr.findIndex(compare)
  // 如果找的到我们就把它删了
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  // 先定义一个空数组
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 数组插好后，再存进storage
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从本地缓存读取searchHIstory
export function loadSearch () {
  // 默认值为一个空数组
  return storage.get(SEARCH_KEY, [])
}

// 这个函数用来删除数组中的值
export function deleteSearch (query) {
  // 先拿到本地存储的数组值
  let searches = storage.get(SEARCH_KEY, [])
  // 传入数组，传入比较函数
  deleteFormArray(searches, (item) => {
    return item === query
  })
  // 最后别忘了保存数组
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除搜索记录时直接把key清空
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay (song) {
  // 先定义一个空数组
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item === song
  }, PLAY_MAX_LENGTH)
  // 数组插好后，再存进storage
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读取本地本地缓存的播放列表
export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 把我喜欢的歌曲存到storage里
export function saveFavourite (song) {
  // 先定义一个空数组
  let songs = storage.get(FAVOURITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVOURITE_MAX_LENGTH)
  // 数组插好后，再存进storage
  storage.set(FAVOURITE_KEY, songs)
  return songs
}

// 把storage里我喜欢的歌曲删除
export function deleteFavourite (song) {
  // 先拿到本地存储的数组值
  let songs = storage.get(FAVOURITE_KEY, [])
  // 传入数组，传入比较函数
  deleteFormArray(songs, (item) => {
    return item.id === song.id
  })
  // 最后别忘了保存数组
  storage.set(FAVOURITE_KEY, songs)
  return songs
}

// 读取本地本地缓存的我喜欢播放列表
export function loadFavourite () {
  return storage.get(FAVOURITE_KEY, [])
}
