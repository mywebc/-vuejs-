// 就是我们在mutation前做一些相关处理或异步处理
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavourite, deleteFavourite } from 'common/js/cache'

// 我们点击随机播放后再回来点击列表的歌曲其实歌曲列表已经乱了
// 这个函数的目的找到原来有序列表中的索引在打乱后播放列表中的索引
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击播放的函数
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 判断如果是随机播放模式，
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 找到索引
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  // 如果不是随机模式，播放索引正常
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 该表公共状态的播放模式，随机打乱原来的有序数组，从索引为0的地方开始播放
export const randomPlay = function ({commit}, {list}) {
  // 改变模式
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  // 调用shuffle 打乱歌曲列表
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  // 在搜索页面点击歌曲，其实是往playist添加歌曲
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前播放列表是否有待插入歌曲的索引
  let fpIndex = findIndex(playlist, song)
  // 插入歌曲后索引加一
  currentIndex++
  // 把这首歌插入到当前索引的位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的存在的序号
    if (currentIndex > fpIndex) {
      // 把原来的歌曲删掉后
      playlist.splice(fpIndex, 1)
      // 在他后面的索引都会减一
      currentIndex--
    } else {
      // 如果在前面，现有的歌曲插入后，原来的歌曲索引机会加一
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 我们对顺序列表也要修改
  // 找到当前播放歌曲在顺序列表中的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
// 查看当前播放歌曲是否在顺序列表中
  let fsIndex = findIndex(sequenceList, song)
// 往要插入的索引位置插入当前播放歌曲
  sequenceList.splice(currentSIndex, 0, song)
// 如果列表中有当前播放歌曲的话，删除原有歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  // 把这些改动提交到mutations
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 这里封装一个我们将搜索记录缓存到浏览器的localStorage里
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 点击删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空列表
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除列表中的歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 找到播放列表和顺序列表的索引，删除
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 我们在这里操作对喜欢数组的增加和删除，然后提交到mutation，同样也要存到storage里
// 添加喜欢
export const saveFavouriteList = function ({commit}, song) {
  commit(types.SET_FAVOURITE_LIST, saveFavourite(song))
}
// 删除喜欢
export const deleteFavouriteList = function ({commit}, song) {
  commit(types.SET_FAVOURITE_LIST, deleteFavourite(song))
}
