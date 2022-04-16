<template>
  <div class="linkpayment__wrap">
    <div class="linkpayment__card" v-for="(item, i) in list" :key="i">
      <div class="pic">
        <img v-if="i !== 0" src="@/assets/images/logo.png" alt="" />
      </div>
      <div class="info">
        <div class="head">
          <div class="title">{{ numMap[i] }}级总户</div>
          <div class="feature">
            <Icon type="md-add" @click="showAccount('editAccount', i)" />
            <Icon type="ios-albums-outline" @click="deleteAccount(i)" />
          </div>
        </div>
        <div class="enterprise">
          <Poptip
            trigger="hover"
            :content="item.enterprise"
            placement="top-start"
          >
            <div class="ellipsis">{{ item.enterprise + item.enterprise }}</div>
          </Poptip>
        </div>
        <div class="account">
          <Poptip trigger="hover" :content="item.account" placement="top-start">
            <div class="ellipsis">{{ item.account }}</div>
          </Poptip>
        </div>
        <div class="line">
          <div style="border-top: 1px solid #ddd;"></div>
        </div>
        <div class="amount">
          <Poptip trigger="hover" :content="item.amount" placement="top-start">
            <div class="ellipsis">{{ item.amount }}</div>
          </Poptip>
        </div>
        <div class="status">
          <span @click="isShowStatusModal = true">
            审批状态 <Icon type="ios-albums-outline" />
          </span>
          <span @click="isShowDetailsModal = true">
            交易详情 <Icon type="ios-albums-outline" />
          </span>
        </div>
      </div>
    </div>
    <!-- 默认编辑卡片 -->
    <div
      class="linkpayment__card"
      key="edit"
      v-if="isShowEditCard"
      @click="showAccount('addAccount')"
    >
      <div class="pic">
        <img v-if="list.length > 0" src="@/assets/images/logo.png" alt="" />
      </div>
      <div class="addAcount">
        <Icon type="ios-albums-outline" />
        <p>添加联动账户</p>
      </div>
    </div>
    <!-- 账号弹窗 -->
    <Modal
      :title="actionType === 'editAccount' ? '编辑账号' : '添加账号'"
      v-model="isShowAccModal"
      :mask-closable="false"
      @on-ok="confirmAccount"
      @on-cancel="cancel"
    >
      <Input v-model="accountObj.enterprise" placeholder="请选择企业" />
      <Input v-model="accountObj.account" placeholder="请选择账号" />
      <Input v-model="accountObj.amount" placeholder="请选择金额" />
    </Modal>
    <!-- 审批状态弹窗 -->
    <Modal title="审批状态" v-model="isShowStatusModal" footer-hide>
      审批状态列表
    </Modal>
    <!-- 交易详情弹窗 -->
    <Modal title="交易详情" v-model="isShowDetailsModal" footer-hide>
      交易详情
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'AccountCard',
  props: {
    list: {
      type: Array,
      default: () => [
        {
          enterprise: '中国平安集团金融股份有限公司1218',
          account: '1234567891011121314',
          amount: '999,888,777,258.51元'
        }
      ]
    },
    kind: {
      type: String,
      // 创建 展示 编辑
      default: '1'
    }
  },
  computed: {
    isShowEditCard() {
      return this.list.length < 4;
    },
    accountList() {
      // 深拷贝
      return JSON.parse(JSON.stringify(this.list)) || [];
    }
  },
  data() {
    return {
      numMap: { 0: '一', 1: '二', 2: '三', 3: '四' },
      isShowAccModal: false,
      actionType: '',
      selectedIndex: 0,
      accountObj: { enterprise: '', account: '', amount: '' },
      isShowStatusModal: false,
      isShowDetailsModal: false
    };
  },
  created() {},
  methods: {
    deleteAccount(index) {
      this.$Modal.confirm({
        title: '系统提示',
        content: '确定删除该账户吗？',
        onOk: () => {
          this.accountList.splice(index, 1);
          this.$emit('update:list', this.accountList);
        }
      });
    },
    showAccount(type, index) {
      this.isShowAccModal = true;
      this.actionType = type;
      this.selectedIndex = index;
      this.accountObj = this.accountList[index] || {
        enterprise: '',
        account: '',
        amount: ''
      };
    },
    confirmAccount() {
      if (this.actionType === 'editAccount') {
        this.accountList.splice(this.selectedIndex, 1, this.accountObj);
      } else {
        this.accountList.push(this.accountObj);
      }
      this.$emit('update:list', this.accountList);
    },
    cancel() {}
  }
};
</script>
<style lang="less" scoped>
.linkpayment__wrap {
  display: flex;
  padding: 16px;
  // 偏移量使其居中显示
  margin-left: -3.75%;
}
.linkpayment__card {
  width: 25%;
  display: flex;
  .info,
  .addAcount {
    width: 85%;
    text-align: left;
    border: 1px solid #ccc;
    border-radius: 4px;
    .head {
      display: flex;
      justify-content: space-between;
      .title {
        padding: 2px 4px;
        background: lightcoral;
        border-radius: 0 0 8px 0;
      }
      .feature {
        cursor: pointer;
        padding-right: 12px;
      }
    }
    .enterprise,
    .account,
    .amount,
    .status,
    .line {
      padding: 6px 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      line-height: 16px;
    }
    > div {
      &:first-child {
        padding-bottom: 8px;
      }
      &:last-child {
        padding-bottom: 16px;
      }
    }
  }
  .pic {
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 90%;
    }
  }
  .addAcount {
    display: flex;
    min-height: 120px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="less">
.linkpayment__card {
  .ivu-poptip {
    width: 100%;
  }
  .ivu-poptip-rel {
    width: 100%;
  }
}
</style>
