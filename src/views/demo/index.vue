<template>
  <div>
    <AccountCard :list.sync="list"></AccountCard>
    <CampAnimation />
    <br />
    <CampBar />
    <br />
    <DatetimePicker />
    <RmbInput></RmbInput>
    <TextExpandAndCollapse :content="content" />
    <TextExpandedAndClosed :content="content" />

    <Button @click="sendRequest">ajax</Button>
  </div>
</template>

<script>
import AccountCard from '@/components/account-card';
import CampAnimation from '@/components/camp-animation';
import CampBar from '@/components/camp-bar';
import DatetimePicker from '@/components/datetime-picker';
import RmbInput from '@/components/rmb-input';
import TextExpandAndCollapse from '@/components/text-expand-and-collapse';
import TextExpandedAndClosed from '@/components/text-expanded-and-closed';
export default {
  components: {
    AccountCard,
    CampAnimation,
    CampBar,
    DatetimePicker,
    RmbInput,
    TextExpandAndCollapse,
    TextExpandedAndClosed
  },
  data() {
    return {
      list: [
        {
          enterprise: '中国平安集团金融股份有限公司',
          account: '12345678910',
          amount: '999,888,777,258.51元'
        }
      ],
      content:
        '中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218中国平安集团金融股份有限公司1218'
    };
  },
  mounted() {},
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
    }
  }
};
</script>
