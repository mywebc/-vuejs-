<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!--里面的进度条-->
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  // 进度条中小球的宽度
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      // 多个函数共享
      this.touch = {}
    },
    methods: {
      progressTouchStart (e) {
        // 先初始化initiated
        this.touch.initiated = true
        // 记录开始点击时x的位置
        this.touch.startX = e.touches[0].pageX
        // 记录进度条的位置
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        // 如果没有初始化,return 掉
        if (!this.touch.initiated) {
          return
        }
        // 拿到偏移量
        const deltaX = e.touches[0].pageX - this.touch.startX
        // 偏移量要大于0且小于进度条的长度
        const offsetWIdth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWIdth)
      },
      progressTouchEnd (e) {
        this.touch.initiated = false
        // 在结束的时候派发一个事件
        this._triggerPercent()
      },
      // 向外派发事件，告诉他我的percent已经改变
      _triggerPercent () {
        // 拿到总长度，再拿到拖动后的长度，把新的百分比派发出去(这里基础组件不会在这做业务逻辑相关的)
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      // 计算偏移量函数
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      // 点击进度条
      progressClick (e) {
        // 这个获取点击的x值是有问题的，当我们点击progressBtn时
        // this._offset(e.offsetX)
        // 我们可以改成获取他的pageX,getBoundingClientRect返回一个集合，
        // 包含该元素left、top,bottom,right的值
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    },
    watch: {
      percent (newPercent) {
        // 当百分比变化时，并且不在拖动时
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
