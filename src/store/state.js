import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavourite } from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(), // 初始值从缓存里读
  playHistory: loadPlay(),
  favouriteList: loadFavourite()
}

export default state
