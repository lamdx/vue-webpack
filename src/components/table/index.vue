<template>
  <div v-if="refresh">
    <Table
      ref="table"
      :data="tableData"
      :columns="tableColumns"
      :border="border"
      :loading="loading"
      :highlight-row="highlightRow"
      :max-height="maxHeight"
      :row-class-name="rowClassName"
      :draggable="draggable"
      @on-current-change="emitCurrentChange"
      @on-select="emitSelect"
      @on-select-cancel="emitSelectCancel"
      @on-select-all="emitSelectAll"
      @on-select-all-cancel="emitSelectAllCancel"
      @on-selection-change="emitSelectionChange"
      @on-sort-change="emitSortChange"
      @on-row-click="emitRowClick"
      @on-expand="emitExpand"
      @on-drag-drop="emitDragDrop"
    >
      <template
        v-for="item in tableColumns"
        slot-scope="{ row, column }"
        :slot="item.slot"
      >
        <slot :name="item.slot" :data="row"></slot>
      </template>
    </Table>
    <div v-show="total > 0">
      <div>
        共{{ total }}条记录 第{{ total > 0 ? searchParams : 0 }} /{{
          total && total > 0 ? Math.ceil(total / searchParams.pageSize) : 0
        }}页
      </div>
      <Page
        :total="searchParams"
        :page-size="searchParams"
        :current="searchParams"
        placement="top"
        show-sizer
        @on-change="changePage"
        @on-page-size-change="changePageSize"
      />
    </div>
  </div>
</template>
<script>
import { deepCopy } from '@/utils/index';
import { getItem, setItem } from '@/utils/storage.js';
export default {
  name: 'MyTable',
  props: {
    value: [String, Number, Array],
    url: {
      type: String,
      default: ''
    },
    searchParams: {
      type: Object,
      default: () => ({})
    },
    requstMethod: {
      type: String,
      default: 'post'
    },
    autoRequest: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    highlightRow: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: [String, Number]
    },
    rowClassName: {
      type: Function
    },
    // 是否跨页多选
    crossPage: {
      type: Boolean,
      default: false
    },
    // 用于跨页多选的时候，判断当前页的数据是否已选中的标记名称
    idName: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      refresh: true,
      loading: false,
      tableData: [],
      tableColumns: [],
      params: {},
      total: 0,
      selectedRow: [], // 选中行的数据
      pageSelectRow: {} // 每页对应的选中行数据
    };
  },
  watch: {
    value: {
      handler(val) {
        this.tableData = val || [];
      },
      immediate: true
    },
    searchParams: {
      handler(val) {
        this.params = deepCopy(val);
      }
    },
    columns: {
      handler(val) {
        this.tableColumns = deepCopy(val);
        this.refresh = false;
        this.$nextTick(() => {
          this.refresh = true;
        });
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    initCache() {
      let keys = ['CURRENCY', 'EXE_TYPE'];
      this.initDicts(keys);
    },
    initDicts(keys, callback) {
      keys = [...new Set(keys)];
      let promises = [];
      keys.forEach(key => {
        promises.push(this.getDictsByKey(key));
      });
      Promise.all(promises).then(res => {
        callback && callback(res);
      });
    },
    getDictsByKey(key) {
      return new Promise(resolve => {
        let list = getItem(key, 'session');
        if (list.length > 0) {
          resolve(list);
          return;
        }
        let url = '';
        this.$request({
          url,
          params: { dictCode: key },
          method: 'get'
        }).then(res => {
          setItem(key, res.data, 'session');
          resolve(res.data);
        });
      });
    },
    async init() {
      if (this.tableColumns.length > 0) {
        this.tableColumns.forEach(column => {
          if (!column.render && !column.slot) {
            if (column.format) {
              column.render = (h, params) => {
                let _value = this.$options.filters[column.format](
                  params.row[column.key]
                );
                return h('div', _value || '--');
              };
            } else if (column.cached) {
              column.render = (h, params) => {
                let _value = this.$store.getters['cached/getCachedDictName'](
                  column.cached,
                  params.row[column.key]
                );
                return h('div', _value || '--');
              };
            }
          }
        });
      }
    },
    handleQuery() {
      if (!this.url || !this.searchParams) {
        return false;
      }
      // 数据加载中
      this.loading = true;
      let _params = {
        url: this.url,
        method: this.requstMethod
      };
      if (this.requstMethod.toLowerCase === 'get') {
        _params['params'] = this.searchParams;
      } else {
        _params['data'] = this.searchParams;
      }
      this.$request(_params)
        .then(res => {
          this.tableData = res.data.result;
          this.total = res.data.total;
          if (this.tableData.length > 0) {
            // 设置默认高亮第一行
            this.tableData[0]._heighlight = true;
            // 设置默认选中第一行
            this.emitCurrentChange(this.tableData[0], null);
            // 触发单击行事件
            this.emitRowClick(this.tableData[0], 0);
            // 跨页选中项勾选状态
            if (this.crossPage) {
              for (let i in this.tableData) {
                for (let j of this.selectedRow) {
                  this.tableData[i]['_checked'] = false;
                  if (this.tableData[i][this.idName] === j[this.idName]) {
                    this.tableData[i]['_checked'] = true;
                    break;
                  }
                }
              }
            }
            this.$emit('request-success', this.tableData, this.searchParams);
          } else {
            this.emitCurrentChange({}, null);
            this.emitRowClick({}, null);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changePage(number) {
      this.searchParams.pageNumber = number;
      if (!this.crossPage) {
        this.emitSelectionChange([]);
      }
      this.handleQuery();
    },
    changePageSize(size) {
      this.searchParams.pageNumber = 1;
      this.searchParams.pageSize = size;
      this.handleQuery();
    },
    // table event API
    // currentRow：当前高亮行的数据
    // oldCurrentRow：上一次高亮的数据
    emitCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow);
    },
    // selection：已选项数据
    // row：刚选择的项数据
    emitSelect(selection, row) {
      this.$emit('on-select-cancel', selection, row);
    },
    // selection：已选项数据
    // row：取消选择的项数据
    emitSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row);
    },
    emitSelectAll(selection) {
      this.$emit('on-select-all', selection);
    },
    emitSelectAllCancel(selection) {
      this.$emit('on-select-all-cancel', selection);
    },
    emitSelectionChange(selection) {
      // 允许跨页选择
      if (this.crossPage) {
        this.pageSelectRow[this.searchParams.pageNumber] = selection;
        this.selectedRow = [];
        for (let i in this.pageSelectRow) {
          for (let j in this.pageSelectRow[i]) {
            this.selectedRow.push(j);
          }
        }
        this.$emit('on-select', this.selectedRow);
      } else {
        this.$emit('on-select', this.selection);
      }
    },
    // column：当前列数据
    // key：排序依据的指标
    // order：排序的顺序，值为 asc 或 desc
    emitSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order);
    },
    emitRowClick(row, index) {
      this.$emit('on-row-click', row, index);
    },
    // row：当前行的数据
    // status：当前的状态
    emitExpand(row, status) {
      this.$emit('on-expand', row, status);
    },
    // 拖拽排序松开时触发，返回置换的两行数据索引 index1，index2
    emitDragDrop() {
      this.$emit('on-drag-drop');
    },

    // 清空多选项
    clearSelection() {
      this.selectedRow = [];
      this.pageSelectRow = [];
    },
    // 重置表头状态
    resetColumnsStatus() {
      this.$refs.table.cloneColumns.forEach(column => {
        column._isFiltered = false;
        column._filterVisible = false;
        column._filterChecked = [];
        column._sortType = 'normal';
      });
    },
    // 全选，取消全选 status: true false
    selectAll(status) {
      this.$refs.table.selectAll(status);
    }
  }
};
</script>
<style scoped></style>
