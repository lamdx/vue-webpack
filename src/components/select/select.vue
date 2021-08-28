<template>
  <div>
    <Select
      ref="select"
      v-model="svalue"
      :transfer="transfer"
      :disabled="disabled"
      :clearable="clearable"
      :placeholder="placeholder"
      :multiple="multiple"
      :max-tag-count="maxTagCount"
      :max-tag-placeholder="maxTagPlaceholder"
    >
      <Option v-for="(option, i) in options" :key="i" :value="option.value">
        {{ option.name }}
      </Option>
    </Select>
  </div>
</template>
<script>
import storage from '@/utils/storage.js';
export default {
  props: {
    value: [String, Number, Array],
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({})
    },
    optionlists: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default: false
    },
    maxTagCount: {
      type: Number,
      default: 1
    },
    maxTagPlaceholder: {
      type: Function,
      default: num => {
        return '+' + num;
      }
    }
  },
  data() {
    return {
      svalue: '',
      options: []
    };
  },
  watch: {
    value: {
      handler(val) {
        if (
          (typeof val === 'string' && val === '') ||
          (Array.isArray(val) && val.length === 0)
        ) {
          this.$refs.select.reset();
        }
      },
      immediate: true
    },
    optionlists: {
      handler(val) {
        if (val.length > 0) {
          this.options = val;
        }
      },
      immediate: true
    },
    svalue: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('input', this.svalue);
        }
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // 优先展示传入的 optionlists
      if (this.optionlists.length > 0) return;
      if (this.url && this.params) {
        let key = this.params.dictCode;
        let list = storage.getItem(key, 'session');
        // 枚举值优先从缓存中获取
        if (list && Array.isArray(list)) {
          this.options = list;
        } else {
          this.$request({
            url: this.url,
            params: this.params,
            method: 'get'
          }).then(res => {
            this.options = res.data;
            storage.setItem(key, res.data, 'session');
          });
        }
      }
    },
    // Select 原生重置方法
    reset() {
      this.$refs.select.reset();
    }
  }
};
</script>
<style scoped></style>
