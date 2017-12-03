import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {

  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    // 具体功能我们在具体组件里实现，我们在组件里定义这个函数，如果有就会覆盖他，没有就会报错
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// 切换播放模式共享代码
export const playerMixin = {
  computed: {
    // 计算属性里，根据不同的播放模式切换不同的图标
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playlist',
      'favouriteList'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      // 对应的改变歌曲列表
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 当我们切换播放模式时，我们希望当前歌曲不要切换，所以要保证currentIndex不变
    resetCurrentIndex (list) {
      // es6语法,findIndex，返回数组中符合条件的索引
      let index = list.findIndex((item) => {
        // 要保证currentSong的id不变
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 切换收藏图标
    getFavouriteIcon (song) {
      if (this.isFavourite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    // 点击收藏按钮
    toggleFavourite (song) {
      if (this.isFavourite(song)) {
        this.deleteFavouriteList(song)
      } else {
        this.saveFavouriteList(song)
      }
    },
    isFavourite (song) {
      // 去favouriteList里找
      const index = this.favouriteList.findIndex((item) => {
        return item.id === song.id
      })
      // 大于-1，return true
      return index > -1
    },
    ...mapActions([
      'saveFavouriteList',
      'deleteFavouriteList'
    ]),
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}

// 搜索相关的服用代码
export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      // 当我们点击后传入这个查询的值，用来保存在state中和插入localstorage中
      this.saveSearchHistory(this.query)
    },
    // 从文本框派发出来的事件，改变的query在这里接受
    onQueryChange (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
