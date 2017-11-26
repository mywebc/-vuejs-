<template>
  <div class="singer" ref="singer">
    <!--接受props-->
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import Singer from 'common/js/singer'
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  // vuex提供的语法糖，向mutations发送数据
  import { mapMutations } from 'vuex'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 我们在这里就是利用mutation把singer存到公共仓库
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
            console.log(this.singers)
          }
        })
      },
      // 获取歌手列表
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          // 循环数组找出10个push到热门
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          // 字母开头赋值给key,创建字母数组
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 现在我们要给map排序
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          // 如果它匹配字母，就push进ret
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      // 可以通过以下来映射到mutations. this.setSinger(singer)的方式提交到mutation供其修改
      ...mapMutations({
        // 我们在这里设置了一个映射，setSinger就映射到了mutation里的SET_SINGER函数，以便我们方便修改
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
