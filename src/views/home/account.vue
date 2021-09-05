<template>
  <div>
    <Button @click="req">req</Button>
    <card :list.sync="accountList"></card>
    <rmbInput></rmbInput>
  </div>
</template>
<script>
import card from '@/components/card';
import rmbInput from '@/components/input';
export default {
  components: { card, rmbInput },
  data() {
    return {
      accountList: [
        {
          enterprise: '中国平安集团金融股份有限公司1218',
          account: '1234567891011121314',
          amount: '999,888,777,258.51元'
        }
      ]
    };
  },
  methods: {
    req() {
      this.$request({
        url: '/order/v1/orderlist',
        method: 'post',
        data: new FormData()
      }).then(() => {});
    }
  }
};
</script>
<style lang="less"></style>
