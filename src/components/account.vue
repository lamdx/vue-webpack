<template>
  <div class="account"></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    // this.req();
  },
  methods: {
    req() {
      this.$request({
        url: '/order/v1/orderlist',
        method: 'post',
        data: { dd: 55 }
      }).then(() => {});
    }
  }
};
</script>
<style lang="less">
.account {
}
</style>
