<template>
  <div class="pane" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabPane',
  props: {
    name: { type: String, default: '' },
    label: { type: [String, Function], default: '' },
    count: { type: Number, default: 0 }
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    updateNav() {
      this.$parent.updateNav();
    }
  },
  watch: {
    label() {
      this.updateNav();
    },
    name() {
      this.updateNav();
    }
  },
  mounted() {
    this.updateNav();
  },
  destroyed () {
    this.updateNav();
  }
};
</script>
<style scoped>
.pane {
  min-height: 100px;
  background-color: red;
}
</style>
