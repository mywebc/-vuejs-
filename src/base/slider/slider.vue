<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'

  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    name: 'slider',
    // 父组件给子组件props传值
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    // 用better-scroll，在mounted（已经挂载到DOM后）里初始化
    mounted () {
      // 浏览器刷新在17毫秒左右,所以20毫秒
      setTimeout(() => {
        this._setSliderWidth()
        this._initSlider()
        this._initDots()
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 原来我们可以根据可视大小，设置图片宽度，可视大小改变后，需要重新设置图片大小
      window.addEventListener('resize', () => {
        // slider 还没有初始化的时候，什么都不做
        if (!this.slider) {
          return
        }
        // 重新设置
        this._setSliderWidth(true)
        // better-scroll 自带的接口
        this.slider.refresh()
      })
    },
    methods: {
      // 设置图片宽度，图片容器宽度
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        // 获取可视窗口宽度
        let sliderWidth = this.$refs.slider.clientWidth
        // 遍历循环每张图片，添加样式，设置宽度
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          // 添加样式
          addClass(child, 'slider-item')
          // 设置单个宽度
          child.style.width = sliderWidth + 'px'
          // 整个宽度
          width += sliderWidth
        }
        // 不传参数这里就会执行，传参数就不执行
        // 如果是loop的话，他会默认再复制两份，所以我们要再加两个sliderWidth的长度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化轮播图小圆点
      _initDots () {
        this.dots = new Array(this.children.length - 2)
      },
      // 设置轮播跳转
      _play() {
        // 当前索引为0，给它加上一
        let pageIndex = this.currentPageIndex + 1
        // 如果设置循环，页数加一
        if (this.loop) {
          pageIndex += 1
        }
        // 开启定时器，调用better-scroll接口，跳转相应页面
        this.timer = setTimeout(() => {
          // better-scroll 的接口，x轴方向的索引，y方向的索引，时间
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      // 初始化slider，配置 一些参数
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: true,
            threshold: 0.3,
            speed: 400
          },
          click: true
        })
        // 每次滚动结束后触发此事件
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          // 每跳转一次，清空计时器，重启定时器
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      }
    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
