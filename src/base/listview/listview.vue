<template>
  <!--绑定data，当data数组发生变化时重新refresh-->
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType"
  >
    <ul>
      <!--首先循环外面第一层数组-->
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <!--再循环第二层数组-->
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右边固定的字母-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStar" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :class="{'current': currentIndex === index}"
            :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <!--滚动固定-->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <!--没加载数据前loading效果-->
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>

</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'
  import Loading from 'base/loading/loading'
  // 右边每个锚点的高度为18像素
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created () {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    // 给儿子传一些数据
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    // 添加计算属性，在这里获取到右边固定title
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      refresh () {
        this.$refs.listview.refresh()
      },
      // 它是个子组件，只负责向外派发事件。它爸爸接受后决定是否激活，也就是singger.vue
      selectItem (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStar (e) {
        // 获取索引值
        let anchorIndex = getData(e.target, 'index')
        // 记录touch的初始y值
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        // 同时也记录一下一开始是第几个索引
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        // 右侧滑动时，左侧也要跟着滑动，我们需要在touchstart时候记录y的值
        // 两个函数共享的话，我们放到create里，为什么不放到data里，vue会自动帮我们监测，我们不需要监测
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 或0就是向下取整一样的，这里算出了偏移了几个锚点
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // 相应的我们就知道右边能移动几个group,再调用scrollToElement
        // 字符串和数字相加就会变成一个新的字符串，需要转化
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      // 子组件给父组件发送的事件
      scroll (pos) {
        // 实时获取scrollY
        this.scrollY = pos.y
      },
      // 相同的代码封装一下
      _scrollTo (index) {
        // 右侧快速滑动时点击最上面和最下面点击应该无效，可以这样设置
        if (!index && index !== 0) {
          return
        }
        // 当它滑动时也要做相应的处理
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        // 第二个参数表示 我们不需要什么过渡动画
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算每个Group 的高度
      _calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          // 获取到每一个Group
          let item = list[i]
          // 因为是dom元素，可以直接是clientHeight
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    // 监测数据变化，有变化后重新渲染
    watch: {
      data () {
        // 把data挂载到DOM上是有时间的
        setTimeout(() => {
          // data一旦变化立马重新更新数据
          this._calculateHeight()
        }, 20)
      },
      // 监听scrollY的变化
      scrollY (newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 当滚动到中间
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          // 当它在height1和height2之内，获取索引值
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // 计算diff的值，就是上限和下限之间的距离
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff (newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll, Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
