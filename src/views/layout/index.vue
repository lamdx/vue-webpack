<template>
  <div class="layout">
    <div class="topinfo">
      <p>
        <span>序号</span>
        <span>20201128</span>
      </p>
      <p>
        <span>简介</span>
        <span>如无乱世，何出英雄？美酒被英雄所饮，那是美酒的福分</span>
      </p>
    </div>
    <ul class="sections">
      <li v-for="(item, i) in list" :key="i" class="section">
        <p class="each-item title">
          <span class="title-left">产品{{ i + 1 }}</span>
          <span class="title-right">{{ item.id }}</span>
        </p>
        <p class="each-item">
          <span>配置</span>
          <span class="right">{{ item.config }}</span>
        </p>
        <p class="each-item">
          <span>参数</span>
          <span class="item-right">{{ item.params }}</span>
        </p>
        <a>查看详情</a>
      </li>
    </ul>
    <div class="pcsection">
      <div class="part">
        <span :class="{ update: updateObj.id }">内部户号：</span>
        <span>{{ resData.after.id }}</span>
      </div>
      <div class="part">
        <span :class="{ update: updateObj.title }">账户性质：</span>
        <span>{{ resData.after.title }}</span>
      </div>
      <div class="part">
        <span :class="{ update: updateObj.subtitle }">浮动透支协定比例：</span>
        <span>{{ resData.after.subtitle }}</span>
      </div>
      <div class="part">
        <span :class="{ update: updateObj.time }">开户日期：</span>
        <span>{{ resData.after.time }}</span>
      </div>
      <div class="part">
        <span :class="{ update: updateObj.zan }">账户状态：</span>
        <span>{{ resData.after.zan }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Layout',
  data() {
    return {
      comName: '',
      list: [
        {
          id: 123,
          config: '如无乱世，何出英雄？美酒被英雄所饮，那是美酒的福分。',
          params: 'inter 7 '
        }
      ],
      updateObj: [],
      resData: {
        before: {
          id: 267,
          title: '集团',
          subtitle: '25%',
          time: '19/12/10 16:34',
          num: '2',
          zan: '已办理',
          account: []
        },
        after: {
          id: 390,
          title: '企业',
          subtitle: '30%',
          time: '19/12/10 16:34',
          num: 125,
          zan:
            '无需办理无需办理无需办理无需办理无需办理无需办理无需办理无需办理',
          account: []
        }
      }
    };
  },
  created() {
    this.compareObj();
  },
  methods: {
    compareObj() {
      let keys = Object.keys(this.resData.after);
      keys.forEach(key => {
        if (key === 'account') return;
        if (this.resData.before[key] !== this.resData.after[key]) {
          this.updateObj[key] = true;
          let str = `${this.resData.after[key]}(修改前:${this.resData.before[key]})`;
          this.resData.after[key] = str;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.layout {
  .topinfo {
    padding: 0;
    border: 1px solid #000;
    p {
      display: flex;
      justify-content: space-between;
      padding: 8px 10px;
      line-height: 24px;
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
      span {
        padding: 0 10px;
        text-align: left;
        &:first-child {
          width: 110px;
          color: #999;
        }
        &:last-child {
          width: calc(100% - 110px);
          padding-right: 0;
          color: #333;
        }
      }
    }
  }
  .sections {
    padding: 0;
    // li
    .section {
      margin: 10px;
      background: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      // p
      .each-item {
        margin: 0 8px;
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d9d9d9;
        font-size: 14px;
        line-height: 24px;
        word-wrap: break-word;
        word-break: break-all;
        &:first-child {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        &:last-child {
          border: 0;
        }
        &.title {
          margin: 0;
          padding: 8px;
          background: #ededed;
        }
        span {
          padding: 0 10px;
          text-align: left;
          &:first-child {
            width: 110px;
            color: #999;
          }
          &:last-child {
            width: calc(100% - 110px);
            color: #333;
          }
          &.title-left {
            color: #000;
            font-size: 18px;
            font-weight: bold;
          }
          &.title-right {
            color: #000;
            font-size: 18px;
            font-weight: bold;
          }
          &.item-right {
            text-align: right;
          }
        }
      }
      > a {
        padding: 8px;
        display: block;
        color: #1f62f3;
        line-height: 24px;
        text-align: center;
      }
    }
  }
  .pcsection {
    display: flex;
    box-sizing: border-box;
    justify-content: flex-start;
    // align-items: flex-start;
    flex-flow: row wrap;
    border: 1px solid red;
    > .part {
      width: 33.333%;
      min-height: 40px;
      display: flex;
      justify-content: space-between;
      .update::before {
        content: "改";
        width: 25px;
        height: 25px;
        display: inline-block;
        position: relative;
        left: -5px;
        top: 0;
        background: #f3a1b6;
        border-radius: 50%;
        line-height: 25px;
        text-align: center;
      }
      > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 25px;
        // word-wrap: break-word;
        // word-break: break-all;
        &:first-of-type {
          width: 12em;
          text-align: right;
        }
        &:last-of-type {
          flex: 1;
          padding-left: 8px;
        }
      }
    }
  }
}
</style>
