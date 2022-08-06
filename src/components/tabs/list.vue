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
  created() {
    this.ajax();
  },
  methods: {
    ajax() {
      console.log('ajax');
      setTimeout(() => {
        this.res = Math.random() * 10 + 1;
      });
    }
  }
};
</script>
