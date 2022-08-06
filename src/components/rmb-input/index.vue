<template>
  <div>
    <Input
      v-model.trim="currentValue"
      :element-id="elementId"
      :disabled="disabled"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :clearable="clearable"
      @mouseenter.native="ishover = true"
      @mouseleave.native="ishover = false"
    >
      <Icon
        v-show="!(ishover && value)"
        slot="suffix"
        type="ios-search"
        @click="selectaccount"
      ></Icon>
      <!-- <Icon
        v-show="ishover && value"
        type="ios-close-circle"
        slot="suffix"
      ></Icon> -->
    </Input>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    maxlength: {
      type: Number,
      default: 20
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number
    },
    elementId: {
      type: String
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      ishover: false,
      currentValue: ''
    };
  },
  computed: {
    clearable() {
      return this.currentValue && this.ishover;
    },
    precisionValue() {
      if (!this.currentValue) return this.currentValue;
      return this.precision
        ? this.currentValue.toFixed(this.precision)
        : this.currentValue;
    },
    formatterValue() {
      if (this.formatter && this.precisionValue !== null) {
        return this.formatter(this.precisionValue);
      } else {
        return this.precisionValue;
      }
    }
  },
  watch: {
    currentValue: {
      handler(val) {
        console.log(val);
        this.$emit('input', val);
      },
      immediate: true
    }
  },
  methods: {
    selectaccount() {}
  }
};
</script>
<style scoped></style>
