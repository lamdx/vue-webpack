<template>
  <div class="wrap">
    <div class="content">
      <div :class="[expanded ? 'expanded' : 'closed']" ref="content">
        {{ content }}
      </div>
      <div class="button" v-if="isShowButton" @click="toggle">
        <div class="flex" v-if="expanded">收起<span class="icon">↑</span></div>
        <div class="flex" v-else>
          <span style="color:#666">...</span>
          &nbsp;展开
          <span class="icon">↓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: String, default: '' }
  },
  data() {
    return {
      expanded: true,
      isShowButton: false
    };
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
    }
  },
  watch: {
    content: {
      handler() {
        // 以下这部分函数体可以在 mounted 钩子函数中执行，写在 watch 方便调试各种情况
        this.expanded = true; // expanded 的值必须为 true，才能获取到真正的内容高度
        this.$nextTick(() => {
          if (!this.$refs.content) return;
          // lineHeight webkitLineClamp 的值须与样式中的值保持一致
          const lineHeight = 20;
          const webkitLineClamp = 1;
          if (this.$refs.content.offsetHeight > lineHeight * webkitLineClamp) {
            this.isShowButton = true;
          } else {
            this.isShowButton = false;
          }
          // 设置初始状态为收起
          this.expanded = false;
        });
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
@webkitLineClamp: 1;
@lineHeight: 20px;
@fontSize: 14px;
@fontColor: #666;
@backGroundColor: #fff;
@buttonColor: #68b1e8;
.wrap {
  .content {
    position: relative;
    color: @fontColor;
    line-height: @lineHeight;
    font-size: @fontSize;
    letter-spacing: 0;
    text-align: justify; // 这个算是样式关键点之一
    .expanded {
      height: auto;
      overflow: auto;
      // padding-bottom: @lineHeight;
    }
    .closed {
      max-height: @lineHeight * @webkitLineClamp;
      overflow: hidden;
    }
    .button {
      position: absolute;
      bottom: 0;
      right: 0;
      vertical-align: middle;
      color: @buttonColor;
      font-size: @fontSize;
      background: @backGroundColor;
      .flex {
        display: flex;
      }
      .icon {
        width: 1em;
        line-height: @lineHeight * 0.8;
        vertical-align: middle;
        text-align: center;
      }
    }
  }
}
</style>
