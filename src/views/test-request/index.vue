<template>
  <div>
    <Button @click="sendRequest">sendRequest</Button>
  </div>
</template>

<script>
export default {
  name: 'TestRequest',
  methods: {
    sendRequest() {
      this.$request({
        url: '/api/seller',
        method: 'get'
      }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
<style scoped lang="less"></style>
