<template>
  <h1>{{ res }}</h1>
</template>
<script>
export default {
  data() {
    return {
      res: ''
    };
  },
  methods: {
    ajax() {
      console.log('ajax');
      setTimeout(() => {
        this.res = Math.random() * 10 + 1;
      });
    }
  },
  created() {
    this.ajax();
  }
};
</script>
