<template>
  <div class="account">
    <button @click="req">req</button>
  </div>
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
        data: new FormData()
      }).then(() => {});
    }
  }
};
</script>
<style lang="less">
.account {
  background: #fff;
}
</style>
