<template>
  <Dropdown
    ref="dropdown"
    trigger="custom"
    :visible="visible"
    transfer
    style="width:100%;"
    @on-clickoutside="onClickOutside"
  >
    <div :class="classes">
      <div
        ref="select"
        class="ivu-select-selection enterprise-select"
        @click.stop="onInputFocus"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      >
        <!-- 选择的标签，只有多选模式才显示 tag -->
        <template v-if="multiple">
          <div
            v-if="maxTagCount === undefined || index < maxTagCount"
            v-for="(item, index) in selectedMultiple"
            :key="index"
            :style="tagMaxWidth"
            class="ivu-tag ivu-tag-checked"
          >
            <span class="ivu-tag-text">{{ item.label }} </span>
            <Icon
              v-if="showRemoveTag"
              type="ios-close"
              @click.native.stop="removeTag(item)"
            ></Icon>
          </div>
          <!-- 最大标签显示样式 -->
          <div
            v-if="
              maxTagCount !== undefined && selectedMultiple.length > maxTagCount
            "
            class="ivu-tag ivu-tag-checked"
            @click.stop="showOptions"
          >
            <span ref="MaxTagCount" class="ivu-tag-text ivu-select-max-tag">
              <template v-if="maxTagPlaceholder">
                {{ maxTagPlaceholder(selectedMultiple.length - maxTagCount) }}
              </template>
              <template v-else>
                + {{ selectedMultiple.length - maxTagCount }}
              </template>
            </span>
          </div>
        </template>
        <!-- 输入框 -->
        <Input
          ref="input"
          v-model.trim="queryStr"
          v-not-input-empty.length="60"
          type="text"
          class="ivu-select-input tree-input"
          :placeholder="showPlaceholder ? placeholder : ''"
          autocomplete="off"
          :spellcheck="false"
          :disabled="disabled"
          :style="inputStyle"
          :maxlength="maxlength"
          @on-keydown="resetInputState"
          @on-keydown.delete="handleInputDelete"
          @on-change="onInputChange"
          @on-blur="onInputBlur"
        />
        <!-- 关闭 -->
        <Icon
          v-if="showCloseIcon && !disabled"
          type="ios-close-circle"
          class="ivu-select-arrow"
          @click.stop.self="onClear"
        ></Icon>
        <!-- 下拉 -->
        <Icon
          v-if="!showCloseIcon"
          type="ios-arrow-down"
          class="ivu-select-arrow"
        ></Icon>
      </div>
    </div>
    <!-- 没有找到数据 -->
    <ul
      v-if="showNotFoundLabel && !loading"
      slot="list"
      :class="[prefixCls + '-not-found']"
      :style="treeStyle"
    >
      <li>{{ notFoundText }}</li>
    </ul>
    <!-- 加载中 -->
    <ul
      v-if="loading"
      slot="list"
      :class="[prefixCls + '-loading']"
      :style="treeStyle"
    >
      <li>{{ loadingText }}</li>
    </ul>
    <!-- 树 -->
    <Tree
      v-show="showTree && !showNotFoundLabel && !loading"
      slot="list"
      ref="Tree"
      check-strictly
      :class="treeClasses"
      :style="treeStyle"
      :data="stateTree"
      :show-checkbox="showCheckbox"
      :children-key="childrenKey"
      :render="renderContent"
      @on-check-change="onCheckChange"
    ></Tree>
    <!-- 鼠标悬停时显示选择的列表 -->
    <DropdownMenu
      v-show="!showTree"
      slot="list"
      :class="optionClasses"
      :style="treeStyle"
    >
      <DropdownItem
        v-for="(item, index) of selectedMultiple"
        :key="index"
        class="option-list-item"
      >
        <span>{{ item.label }}</span>
        <Icon
          type="ios-close-circle"
          class="ivu-select-arrow"
          @click.native.stop="removeTag(item, 'dropdown')"
        ></Icon>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import { debounce } from 'throttle-debounce';
import { deepCopy } from '@/utils/index';
// import { directive as onClickOutside } from 'v-click-outside-x';
const prefixCls = 'ivu-select';
const treePrefixCls = 'cz-enterprise-tree';
const $ = function() {};
export default {
  props: {
    showRemoveTag: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: true
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
    maxTagCount: {
      type: Number,
      default: 1
    },
    maxTagPlaceholder: {
      type: Function,
      default: num => {
        return '+' + num;
      }
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    query: {
      type: Object,
      default: function() {
        return {
          status: 0,
          auth: 0
        };
      }
    },
    notFoundText: {
      type: String,
      default: '无匹配数据'
    },
    noDataText: {
      type: String,
      default: '暂无数据'
    },
    loadingText: {
      type: String,
      default: '加载中'
    },
    showDefaultVal: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 60
    },
    remoteUrl: {
      type: String,
      default: ''
    },
    remoteMethod: {
      type: String,
      default: 'get'
    },
    requestParams: {
      type: Object,
      default: () => ({})
    },

    enterpriseId: {
      type: String,
      default: ''
    },
    // 是否展开，默认收起
    collapse: {
      type: Boolean,
      default: false
    },
    // 用户按删除键是否可删除
    disabledDelkey: {
      type: Boolean,
      default: false
    },
    // 禁用根节点
    disabledRootNode: {
      type: Boolean,
      default: false
    },
    customText: {
      type: Function,
      default: title => {
        return title;
      }
    },
    treeProps: {
      type: Object,
      default: () => ({
        name: 'zhName',
        value: 'id'
      })
    },
    formatter: {
      type: Function,
      default: function(treeData) {
        return treeData;
      }
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      visible: false,
      options: [],
      selectMap: new Map(),
      stateTree: this.data || [],
      cacheStateTree: [],
      flatState: [],
      rawFlatState: [],
      showTree: true,
      inputLength: 20,
      queryStr: '',
      loading: false,
      dropDownWidth: '',
      minWidth: 271,
      isFocus: false,
      boxWidth: 0,
      inputWidth: 0,
      selectedNodeId: '',
      isHover: false,
      isShowDefaultVal: false
    };
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-visible`]: this.visible,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-multiple`]: true
        }
      ];
    },
    treeClasses() {
      return [`${treePrefixCls}`];
    },
    treeStyle({ dropDownWidth }) {
      let style = {};
      if (dropDownWidth) {
        style.width = `${dropDownWidth}px`;
      } else {
        style.width = `${this.minWidth}px`;
      }
      return style;
    },
    optionClasses() {
      return [`${treePrefixCls}-option-list`];
    },
    optionStyle() {
      return {
        display: 'none'
      };
    },
    selectedMultiple() {
      return this.options;
    },
    showPlaceholder() {
      let status = false;
      if (!this.options.length > 0 || !this.multiple) {
        status = true;
      }
      return status;
    },
    inputStyle() {
      let style = {};
      if (!this.multiple) return style;
      if (this.showPlaceholder) {
        style = {
          width: '100%'
        };
      } else {
        style = {
          width: `${this.inputWidth}px`
        };
      }
      return style;
    },
    showCloseIcon() {
      const flag = this.isHover && this.clearable;
      if (!this.multiple) {
        return this.queryStr && flag;
      }
      return this.selectedMultiple.length > 0 && flag;
    },
    showNotFoundLabel() {
      return !this.stateTree.length;
    },
    tagMaxWidth() {
      let style = {};
      if (!this.multiple) return style;
      if (
        this.selectedMultiple.length > this.maxTagCount ||
        document.body.clientWidth < 1280
      ) {
        style.maxWidth = '45%';
      } else {
        style.maxWidth = '80%';
      }
      return style;
    },
    showCheckbox() {
      return this.multiple;
    }
  },
  watch: {
    data: {
      handler() {
        this.initSelectData();
      },
      deep: true
    },
    collapse: {
      handler: function(val) {
        this.$nextTick(() => {
          if (val) {
            this.onInputFocus();
          }
        });
      },
      immediate: true
    },
    selectedMultiple() {
      this.setInputWidth();
    }
  },
  created() {
    this.initSelectData();
  },
  destroyed() {
    document.body.style = '';
  },
  methods: {
    /**
     * 设置输入框的宽度
     */
    setInputWidth() {
      if (!this.multiple) return;
      this.$nextTick(() => {
        const boxEl = $(this.$el).find('.enterprise-select')[0];
        const boxWidth = boxEl.getBoundingClientRect().width;
        const children = Array.from(boxEl.children);
        let tagTotalWidth = 0;
        children.forEach(childEl => {
          // 排除 i 标签
          if (childEl.tagName.toLowerCase !== 'i') {
            // tag 元素
            if (childEl.classList.contains('ivu-tag')) {
              const eleWidth = childEl.getBoundingClientRect().width;
              tagTotalWidth += isFinite(eleWidth) ? eleWidth : 0;
            }
          }
        });
        this.inputWidth = boxWidth - tagTotalWidth - 50;
      });
    },
    /**
     * 初始化树
     */
    initSelectData() {
      const { data } = this;
      if (data && data.length > 0) {
        this.resolveStateValue(data);
        this.setInputWidth();
      } else {
        this.fetchTreeData(true, () => {
          this.$nextTick(() => {
            this.setInputWidth();
          });
        });
      }
    },
    /**
     * 自定义节点样式
     */
    renderContent(h, { data }) {
      const query = this.queryStr;
      const propData = {
        class: `ivu-tree-title ${
          data.id === this.selectedNodeId ? 'ivu-tree-title-selected' : ''
        }`
      };
      // 无权限的用户不能点击
      if (!data.hasAuth) {
        propData.style = {
          color: '#c5c8ce',
          cursor: 'not-allowed',
          backgroundColor: 'none'
        };
        propData.class += 'disabled';
      } else {
        propData.on = {
          click: () => {
            data.checked = this.multiple ? !data.checked : true;
            this.onCheckChange([], data);
            this.$emit('on-node-click', data);
          }
        };
      }
      let { title } = data;
      // 添加自定义文字
      if (this.customText && typeof this.customText === 'function') {
        title = this.customText(title, data) || title;
      }
      let titleEl = [];
      // 添加搜索高亮
      if (query) {
        const placeholder = '*';
        const replacedTitle = title.replace(query, placeholder);
        if (replacedTitle.includes(placeholder)) {
          titleEl = replacedTitle.split('').map(item => {
            if (item === placeholder) {
              item = h('span', { style: { color: '#FF710E' } }, query);
            }
            return item;
          });
        } else {
          titleEl = [title];
        }
      } else {
        titleEl = [title];
      }
      return h('span', propData, titleEl);
    },
    /**
     * 鼠标点击外部触发
     */
    onClickOutside(e) {
      const target = e.target;
      const root = $(target).closest(`.${treePrefixCls}`);
      if (root.length <= 0) {
        this.visible = false;
      }
      // 输入查询关键字，如果没有选择，清空查询字符串
      if (!this.selectedNodeId) {
        this.queryStr = '';
      }
      this.isFocus = false;
    },
    emitInput() {
      this.$emit('input', this.getValues());
    },
    /**
     * 显示选择的列表
     */
    showOptions() {
      this.visible = true;
      this.showTree = false;
    },
    /**
     * 清空
     */
    onClear() {
      if (this.disabled) return false;
      this.queryStr = '';
      this.options = [];
      this.selectMap = new Map();
      this.selectedNodeId = '';
      this.emitEvent(this.multiple ? [] : '', [...this.selectMap.values()]);
    },
    /**
     * 重置输入框长度
     */
    resetInputState() {
      this.inputLength = this.$refs.input.value.length * 12 + 20;
    },
    /**
     * 按 Del 键删除
     */
    handleInputDelete(e) {
      if (this.disabledDelkey || this.disabled) return;
      const targetValue = e.target.value;
      if (this.selectedMultiple.length && !this.queryStr && !targetValue) {
        this.removeTag(this.selectedMultiple[this.selectedMultiple.length - 1]);
      }
    },
    /**
     * 输入框聚焦时触发
     */
    onInputFocus(e) {
      if (this.disabled) return false;
      const dropDownWidth = Math.floor(this.$el.getBoundingClientRect().width);
      this.dropDownWidth =
        dropDownWidth < this.minWidth ? this.minWidth : dropDownWidth;
      const maxTagEl = this.$refs.MaxTagCount;
      if (maxTagEl && e && maxTagEl === e.target) {
        return;
      }
      this.showTree = true;
      this.visible = true;
      this.focusInput();
      this.isFocus = true;
      this.fetchTreeData();
      // Fix： 修复下拉列表关闭时偶尔会抖动的问题
      document.body.style = 'overflow:hidden';
    },
    /**
     * 通过关键字搜索 node
     */
    getDataByQueryStr(queryStr) {
      return this.rawFlatState.filter(item =>
        item.node.title.includes(queryStr)
      );
    },
    /**
     * 搜索，输入框值改变时触发
     */
    onInputChange: debounce(16.7, false, function() {
      const { queryStr, rawFlatState, multiple } = this;
      if (!multiple) {
        this.options = [];
      }
      if (!queryStr) {
        this.selectedNodeId = '';
        this.emitInput();
        if (!multiple) {
          // 手动调用 FormItem 的验证方法
          const parent = this.$parent;
          if (parent && parent.onFieldChange) {
            parent.onFieldChange();
          }
        }
        this.resolveStateValue(this.treeData, !!multiple);
      } else {
        this.loading = true;
        this.visible = true;
        setTimeout(() => {
          const result = this.getDataByQueryStr(queryStr).reduce(
            (prev, cur) => prev.concat(cur),
            []
          );
          // 如果无匹配结果，同步外界 v-model
          if (result.length <= 0 || this.options.length <= 0) {
            this.selectedNodeId = '';
            this.emitInput();
          }
          // 获取查询结果和其父节点，组成新的数组
          const queryResult = new Map();
          result.forEach(item => {
            let { parent: parentKey, node } = item;
            // Fix：如果没有 parent 说明是根节点
            if (!parentKey) {
              parentKey = 0;
            }
            const parentNode = rawFlatState[parentKey].node;
            // 重置 children
            node.children = [];
            parentNode.children = [];
            if (!queryResult.has(parentNode.id)) {
              queryResult.set(parentNode.id, parentNode);
            }
            if (!queryResult.has(node.id)) {
              queryResult.set(node.id, node);
            }
          });
          // 把 queryResult 数组组装成 tree 格式的数据
          this.stateTree = deepCopy(this.transferMapToTree(queryResult, true));
          this.flatState = Object.freeze(this.compileFlatState());
          this.loading = false;
        }, 100);
      }
    }),
    onInputBlur() {
      // 如果没有搜索出结果，清空查询关键字
      if (this.stateTree.length <= 0) {
        this.queryStr = '';
        this.showTree = false;
        this.visible = false;
        this.isFocus = false;
        this.emitInput();
      }
    },
    /**
     * 转换 Map
     */
    transferMapToTree(map, expand = false) {
      const nodes = [...map.values()];
      const r = [];
      nodes.forEach(node => {
        // 针对搜索结果进行勾选状态的反显
        // 如果匹配结果存在 selectMap 中， 就勾选
        this.options.forEach(option => {
          if (option.value === node.id) {
            node.checked = true;
          }
        });
        const p = map.get(node.pid);
        if (p && node.id !== node.pid) {
          p.expand = expand;
          p.children.push(node);
        } else {
          r.push(node);
        }
      });
      return r;
    },
    /**
     * 删除选项
     */
    removeTag(option, type) {
      if (this.disabled) return false;
      this.options = this.options.filter(({ value }) => value !== option.value);
      const node = this.flatState.find(item => item.node.id === option.value);
      if (node) {
        this.setNodeChecked(this.getNodeByNodekey(node.nodeKey), false);
        this.removeNodeFromMap(node.nodeKey);
        this.selectedNodeId = '';
      }
      // 下拉列表如果都删除了就显示 Tree
      if (this.options.length === 0 && type === 'dropdown') {
        this.showTree = true;
      }
      this.emitEvent();
      this.focusInput();
    },
    /**
     * 递归获取选中节点及其子节点的 id
     * @params {Array} selection 当前选中的节点
     * @return {Array} ids
     */
    getSelectedNodeIds(selection, child) {
      const ids = child || [];
      for (let i = 0; i < selection.length; i++) {
        const obj = selection[i];
        const children = obj.children;
        // 筛选有权限的节点
        if (obj.hasAuth) {
          ids.push(obj.id);
        }
        if (children && children.length > 0) {
          this.getSelectedNodeIds(children, ids);
        }
      }
      return ids;
    },
    // emit envent
    emitEvent(inputVal, changeVal) {
      let changeParams = changeVal || this.getValuesFromMap();
      this.$emit('input', inputVal || this.getValues());
      this.$emit('on-change', changeParams);
      if (!this.multiple) {
        // on-select 向上兼容，兼容老版本 on-select 事件
        // 参数：选中的节点 参数2：选中的节点及子节点
        if (changeParams && changeParams.length > 0) {
          this.$emit(
            'on-select',
            changeParams[0],
            this.getSelectedNodeIds(changeParams)
          );
        }
      } else {
        this.$emit('on-select', [], []);
      }
    },
    /**
     * 获取 values
     */
    getValues() {
      const ids = this.options.reduce(
        (prev, cur) => prev.concat(cur.value),
        []
      );
      return this.multiple ? ids : ids.toString();
    },
    /**
     * 设置 values 数据反显
     */
    setValues() {
      const { value, flatState, multiple } = this;
      let values = [];
      if (this.showDefaultVal && !this.isShowDefaultVal) {
        this.isShowDefaultVal = true;
        const rootNode = this.flatState[0] ? this.flatState[0].node : {};
        if (rootNode.hasAuth) {
          values = [rootNode.id];
          this.queryStr = rootNode[this.treeProps.name];
        }
      } else {
        values = Array.isArray(value)
          ? multiple
            ? value
            : value[0]
              ? [value[0]]
              : []
          : value
            ? [value]
            : [];
      }
      values.forEach(id => {
        const [filterNode] = flatState.filter(item => item.node.id === id);
        if (filterNode) {
          const node = filterNode.node;
          this.setNodeChecked(node, true);
          this.addNodeToMap(filterNode.nodeKey, node);
          if (!multiple) {
            this.queryStr = node.label;
          }
        }
      });
      this.setOptions();
      if (!this.isFocus) {
        this.emitEvent();
      }
    },
    /**
     * 输入框聚焦
     */
    focusInput() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    /**
     * 扁平化 treeData
     */
    compileFlatState() {
      let keyCounter = 0;
      let childrenKey = this.childrenKey;
      const flatTree = [];
      function flattenChildren(node, parent) {
        node.nodeKey = keyCounter++;
        flatTree[node.nodeKey] = {
          node: node,
          nodeKey: node.nodeKey
        };
        if (typeof parent !== 'undefined') {
          flatTree[node.nodeKey].parent = parent.nodeKey;
          flatTree[parent.nodeKey][childrenKey].push(node.nodeKey);
        }
        if (node[childrenKey]) {
          flatTree[node.nodeKey][childrenKey] = [];
          node[childrenKey].forEach(child => flattenChildren(child, node));
        }
      }
      this.stateTree.forEach(rootNode => {
        flattenChildren(rootNode);
      });
      return flatTree;
    },
    /**
     * 重置除自己外其他节点 checked = false
     */
    resetCheckedExcept(nodeKey) {
      const { flatState } = this;
      for (let i = 0; i < flatState.length; i++) {
        const item = flatState[i];
        if (nodeKey !== item.nodeKey) {
          item.node.checked = false;
        }
      }
    },
    /**
     * 节点勾选时触发
     */
    onCheckChange(nodes, node) {
      const { checked, nodeKey, id } = node;
      const { multiple } = this;
      if (multiple) {
        this.queryStr = '';
      } else {
        this.queryStr = node.label;
        this.visible = false;
        // 单选时的处理逻辑
        // 重置除自己外其他节点的 checked = false
        this.resetCheckedExcept(nodeKey);
      }
      this.$refs.input.focus();

      if (checked) {
        this.selectedNodeId = id;
        // 添加当前节点到 Map
        this.addNodeToMap(nodeKey, node);
        // 需求：如果父节点是折叠状态，当勾选时其下所有的子节点都要勾选
        // 设置子节点为勾选状态，并添加到 Map
        // 只有父节点才存在 expand 属性
        if (
          'expand' in node &&
          !node.expand &&
          node.children.length > 0 &&
          multiple
        ) {
          this.setChildNodeChecked(node.children, true);
        }
      } else {
        this.selectedNodeId = '';
        this.removeNodeFromMap(nodeKey);
        // 取消子节点的勾选状态，并从 Map 中移除
        if (
          'expand' in node &&
          !node.expand &&
          node.children.length > 0 &&
          multiple
        ) {
          this.setChildNodeChecked(node.children, false);
        }
      }
      // 设置 Select 下拉选项及 v-model
      this.setOptions();
      this.emitEvent();
    },
    /**
     * 设置子节点的勾选状态
     */
    setChildNodeChecked(children, state) {
      children.forEach(child => {
        const nodeKey = child.nodeKey;
        const node = this.getNodeByNodekey(nodeKey);
        if (node.hasAuth) {
          this.setNodeChecked(node, state);
        }
        // 如果勾选，添加到 Map
        if (state) {
          this.addNodeToMap(nodeKey, node);
        } else {
          // 如果取消勾选，从 Map 中删除
          this.removeNodeFromMap(nodeKey);
        }
        // 深度递归
        if (node.children && node.children.length > 0) {
          this.setChildNodeChecked(node.children, state);
        }
      });
    },
    /**
     * 设置下拉选项和 v-model 绑定
     */
    setOptions() {
      const nodes = [...this.selectMap.values()];
      const options = [];
      nodes.forEach(node => {
        const label = node.title || node.name;
        const value = node.id || node.value;
        options.push({ label, value });
      });
      this.options = options;
    },
    /**
     * 根据 nodeKey 获取 node
     */
    getNodeByNodekey(nodeKey) {
      const flatNode = this.flatState[nodeKey];
      return flatNode ? flatNode.node : null;
    },
    /**
     * 设置 node 的勾选状态
     */
    setNodeChecked(node, state) {
      this.$set(node, 'checked', state);
    },
    /**
     * 从 Map 集合中删除 node
     */
    removeNodeFromMap(nodeKey) {
      const { selectMap } = this;
      // fix：修复单选时不能删除的 bug
      selectMap.has(nodeKey) && selectMap.delete(nodeKey);
    },
    /**
     * 获取 values
     */
    getValuesFromMap() {
      return [...this.selectMap.values()];
    },
    /**
     * 清空 Map
     */
    clearMap() {
      this.selectMap.clear();
    },
    /**
     * 添加 node 到 Map 集合
     */
    addNodeToMap(nodeKey, node) {
      const { multiple, selectMap } = this;
      // 单选时每次先清空
      if (!multiple) {
        selectMap.clear();
      }
      selectMap.set(nodeKey, node);
    },
    resolveStateValue(treeData, isInitValues = true) {
      this.stateTree = this.deepTransformTreeData(treeData);
      this.cacheStateTree = deepCopy(this.stateTree);
      this.flatState = Object.freeze(deepCopy(this.compileFlatState()));
      this.rawFlatState = Object.freeze(deepCopy(this.flatState));
      if (isInitValues) {
        this.setValues();
      }
    },
    /**
     * 从服务端获取数据
     */
    fetchTreeData(force = false, callback) {
      if (this.treeData && !force) {
        return this.resolveStateValue(this.treeData);
      }
      const { auth, status } = this.query;
      let treeData = [];
      this.loading = true;
      let params = { auth, status, ...this.requestParams };
      if (this.enterpriseId) {
        params.enterpriseId = this.enterpriseId;
      }
      let reqConfig = {
        url: this.remoteUrl,
        method: this.remoteMethod
      };
      if (this.remoteMethod.toUpperCase === 'GET') {
        reqConfig.params = params;
      }
      if (this.remoteMethod.toUpperCase === 'POST') {
        reqConfig.data = params;
      }
      this.$request(reqConfig)
        .then(res => {
          const root = res.data;
          if (Array.isArray(root)) {
            treeData = root;
          } else {
            treeData = root ? [root] : [];
            if (treeData.length > 0 && this.disabledRootNode) {
              treeData[0].disabled = true;
            }
          }
          this.treeData = this.formatter(treeData);
          this.resolveStateValue(this.treeData);
        })
        .catch(err => {
          this.flatState = [];
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
          this.$emit('on-loaded', { data: treeData });
          callback && callback();
        });
    },
    /**
     * 深度转换树数据
     */
    deepTransformTreeData(sourceArr = [], targetArr) {
      const arr = targetArr || [];
      for (let i = 0; i < sourceArr.length; i++) {
        const obj = sourceArr[i];
        const children = obj.children;
        let child = [];
        let title = obj[this.treeProps.name];
        // 已注销的账号后面显示 'xxx已注销'
        if (obj.status === '0') {
          title += '(已注销)';
        }
        const hasAuth = !obj.disabled; // 是否有权限。 true 有； false 无
        const expand = obj.pid === '-1';
        const temp = {
          id: obj[this.treeProps.value],
          pid: obj.pid,
          no: obj.no,
          label: obj[this.treeProps.name],
          value: obj[this.treeProps.value],
          title: title,
          [this.treeProps.name]: title,
          enName: obj.enName,
          expand, // 根节点默认展开
          checked: false,
          hasAuth: hasAuth,
          status: obj.status,
          startUseStatusCd: obj.startUseStatusCd,
          socialCreditCode: obj.socialCreditCode,
          disableCheckbox: !hasAuth // 禁止勾选
        };
        if (children && children.length > 0) {
          child = this.deepTransformTreeData(children, targetArr);
        }
        temp.children = child;
        arr.push(temp);
      }
      return arr;
    }
  }
};
</script>
<style scoped lang="less">
.cz-enterprise-tree {
  padding-left: 6px;
}
.option-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.ivu-select-selection {
  overflow: hidden;
}
.ivu-select-input {
  /deep/ .ivu-input {
    border: none !important;
    padding-left: 0;
    box-shadow: none;
  }
}
.ivu-form-item-error .tree-input {
  /deep/ .ivu-input {
    border: none;
  }
}
.ivu-select-selection,
.ivu-input-wrapper {
  min-width: 0;
}
</style>
