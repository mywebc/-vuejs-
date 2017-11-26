<template>
  <transition name="slider">
    <!--这个组件接受三个数据-->
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>
<script type="text/ecmascript-6">
  // vuex提供的语法糖，从getters接受数据
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getDetail()
      console.log(this.singer)
    },
    methods: {
      _getDetail () {
        // 如果我们直接在当前页面刷新，是拿不到singerID的，所以先判断我们的singerId是通过vuex获取的，我们在点击每个singer时setSinger
        if (!this.singer.id) {
          // 回退到singer页面
          this.$router.push('/singer')
          return
        }
        // 在这里调用jsonp并把singerId传进去
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSong (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          // 必须保证有songid和albumid
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider-enter-active, .slider-leave-active
    transition: all .3s

  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)

</style>
