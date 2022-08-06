<template>
  <div class="demo">
    <Button @click="sendRequest">ajax</Button>
    <AccountCard :list.sync="accountList"></AccountCard>
    <CampAnimation />
    <br />
    <CampBar />
    <br />
    <DatetimePicker />
    <RmbInput></RmbInput>
    <TextExpandAndCollapse :content="content" />
    <TextExpandedAndClosed :content="content" />
    <Checkbox :checkboxList="checkboxList" @on-select="checkboxConfirm" />
    <FlowChart />
    <FoldingPanel />
    <MyHeader title="测试头部" />
    <popupRadio
      :placeholder="'请选择'"
      v-model="popupRadiostatus"
      :options="popupRadioOptions"
      title="mobile单选弹框"
      @onhide="popupRadioOnHide"
    >
      <p slot="popup_header" class="popup_header">
        请选择质押保险办理状态
      </p>
    </popupRadio>
    <ScrollArea />
    <TimeAxis />
    <ViewAll :left="'文件查看'" :right="'查看全部'" @go="goback"></ViewAll>
    <Tabbar />
    <tabs v-model="tabVal" @on-click="clickTab">
      <pane
        v-for="(item, i) in tabList"
        :key="i"
        :label="item.label"
        :name="item.name"
        :count="item.count"
      >
        <list v-if="tabVal === item.name"></list>
      </pane>
      <pane label="标签十三" name="13">
        标签十三内容
      </pane>
    </tabs>
  </div>
</template>

<script>
import compare from '@/mixins/compare';
import AccountCard from '@/components/account-card';
import CampAnimation from '@/components/camp-animation';
import CampBar from '@/components/camp-bar';
import DatetimePicker from '@/components/datetime-picker';
import RmbInput from '@/components/rmb-input';
import TextExpandAndCollapse from '@/components/text-expand-and-collapse';
import TextExpandedAndClosed from '@/components/text-expanded-and-closed';
import Checkbox from '@/components/checkbox';
import FlowChart from '@/components/flow-chart';
import FoldingPanel from '@/components/folding-panel';
import MyHeader from '@/components/my-header';
import PopupRadio from '@/components/popup-radio';
import ScrollArea from '@/components/scroll-area';
import TimeAxis from '@/components/time-axis';
import ViewAll from '@/components/view-all';
import Tabbar from '@/components/tabbar';
import Tabs from '@/components/tabs/tabs';
import Pane from '@/components/tabs/pane';
import List from '@/components/tabs/list';

export default {
  name: 'Demo',
  components: {
    AccountCard,
    CampAnimation,
    CampBar,
    DatetimePicker,
    RmbInput,
    TextExpandAndCollapse,
    TextExpandedAndClosed,
    Checkbox,
    FlowChart,
    FoldingPanel,
    MyHeader,
    PopupRadio,
    ScrollArea,
    TimeAxis,
    ViewAll,
    Tabbar,
    Tabs,
    Pane,
    List
  },
  mixins: [compare],
  data() {
    return {
      accountList: [
        {
          enterprise: '中国平安集团金融股份有限公司',
          account: '12345678910',
          amount: '999,888,777,258.51元'
        }
      ],
      content:
        '中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218',
      popupRadiostatus: '',
      popupRadioOptions: [
        { key: '01', value: '无需办理' },
        { key: '02', value: '办理中' },
        { key: '03', value: '待办中' },
        { key: '04', value: '已办理' }
      ],
      checkboxList: [
        { id: 1, title: '复选框1', desc: '描述1', disable: true },
        {
          id: 2,
          title: '复选框2',
          desc: this.$options.filters['setThousand'](10086, 3)
        }
      ],
      tabList: [
        {
          label: h => {
            return h('div', [
              h('span', '1世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '1',
          count: 1
        },
        {
          label: h => {
            return h('div', [
              h('span', '2世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '2',
          count: 2
        },
        {
          label: h => {
            return h('div', [
              h('span', '3世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '3',
          count: 3
        },
        {
          label: h => {
            return h('div', [
              h('span', '4世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '4',
          count: 4
        },
        {
          label: h => {
            return h('div', [
              h('span', '5世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '5',
          count: 5
        },
        {
          label: h => {
            return h('div', [
              h('span', '6世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '6',
          count: 6
        },
        {
          label: h => {
            return h('div', [
              h('span', '7世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '7',
          count: 7
        },
        {
          label: h => {
            return h('div', [
              h('span', '8世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '8',
          count: 8
        },
        {
          label: h => {
            return h('div', [
              h('span', '9世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '9',
          count: 9
        },
        {
          label: h => {
            return h('div', [
              h('span', '10世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '10',
          count: 10
        },
        {
          label: h => {
            return h('div', [
              h('span', '11世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '11',
          count: 11
        },
        {
          label: h => {
            return h('div', [
              h('span', '12世界级别'),
              h('sup', {
                domProps: {
                  innerHTML: 666
                }
              })
            ]);
          },
          name: '12',
          count: 12
        }
      ],
      tabVal: ''
    };
  },
  watch: {
    // 首次不会被监听到所以需要 immediate: true
    // 监听 $route 需要特别注意，路由 enter & leave 都会触发监听
    $route: {
      handler(to) {
        // to 相当于 newValue
        if (/\/demo/.test(to.path)) {
          this.tabVal = to.query.name;
        }
      },
      immediate: true
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.scrollIntoView();
  //   });
  // },
  methods: {
    sendRequest() {
      this.$request({
        url: '/api/seller',
        method: 'get'
      }).then(res => {
        console.log(res);
      });
      this.$request({
        url: '/api/goods',
        method: 'get'
      }).then(res => {
        console.log(res);
      });
      this.$request({
        url: '/api/account/list',
        method: 'get'
      }).then(res => {
        console.log(res);
        this.list = res.data;
      });
    },
    popupRadioOnHide() {
      console.log('popup-radio：可以进行校验/发起请求');
    },
    checkboxConfirm(data) {
      console.log(data);
    },
    goback() {},
    clickTab(name) {
      console.log(name);
    }
  }
};
</script>
<style scoped lang="less">
.demo {
  padding: 10px;
}
</style>
