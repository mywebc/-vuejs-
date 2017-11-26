// 就是我们在mutation前做一些相关处理或异步处理
import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
