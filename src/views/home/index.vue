<template>
  <div class="home">
    <div>
      <input type="button" value="减" @click="minus" />
      <input id="num" v-model="num" type="text" />
      <input type="button" value="加" @click="add" />
      <!-- 测试样式：属性选择器 跟类选择器权重一样 -->
      <p data-v-2311c06a class="test">属性选择器 跟类选择器权重一样</p>
      <div>1.过滤器的使用-千分符{{ -10086.0 | setThousand }}</div>
      <div class="ellipsis">
        2.单行文本溢出，显示省略号
        如果文字超出父元素指定宽度，文字会自动换行，而连续不间断数字和英文字母(没有其他字符)不会自动换行；
        第一步(不换行)white-space:nowrap;(对于连续的数字或者英文字母可省略)
        第二步(溢出隐藏)overflow:hidden;
        第三步(文本溢出显示省略号)text-overflow:ellipsis;(省略号)
      </div>
      <div class="multi_line_display">
        3.多行文本溢出，最后一行显示省略号
        对于内核是webkit的浏览器(Google/Safari)，可以直接用CSS样式
        (溢出隐藏)overflow:hidden; (省略号)text-overflow:ellipsis;
        (弹性盒模型)display:-webkit-box;
        (设置弹性盒子的子元素的排列方式)-webkit-box-orient:vertical;
        (设置显示文本的行数，最多显示3行)-webkit-line-clamp:2;
      </div>
      <div class="multi_line_display_nature">
        4.多行文本溢出，最后一行显示省略号原理 利用定位和padding-right
        <span class="ellipsis_nature">...</span>
      </div>
      <div>
        <span>
          5.文字和图片对齐
          给img图片属性设置vertical-align，改变的是img前后文字的垂直对齐关系
          取值：top/middle/bottom/baseline默认值，基线
        </span>
        <img
          width="100px"
          style="vertical-align:middle;"
          src="@/assets/images/logo.png"
          alt=""
        />
      </div>
      <div>
        <div style="width:300px;background:#ededed;display:inline-block;">
          6.两个div水平顶部对齐
        </div>
        <div
          style="width:300px;background:#fafafa;display:inline-block;vertical-align:top"
        >
          左右div都设置display:inline-block;
          并且右边的div增加样式vertical-align:top;使得右边的div跟左边的div的顶部对齐
        </div>
      </div>
      <div>
        设置hover悬停切换背景图片
        <a href="javascript:void(0)"></a>
      </div>
      <div>iframe</div>
      <!-- <div>
        <iframe
          src="https://www.baidu.com/"
          id="mobsf"
          scrolling="no"
          frameborder="0"
          style="position:absolute;top:500px;left:0;right:0;bottom:0;"
        ></iframe>
      </div> -->
    </div>
    <label for="fileupload"><p>文件上传label</p></label>
    <input
      id="fileupload"
      ref="fileref"
      type="file"
      accept="image/*"
      style="display:none"
      @change="upload"
    />
    <div class="dropbox">
      <h2 v-if="files.length === 0">
        把要上传的文件拖动到这里
      </h2>
      <div v-for="(file, i) in files" :key="i" style="width:15rem">
        <h5>{{ file.name }}{{ file.message }}</h5>
        <h5>{{ file.uploadPercentage }}</h5>
      </div>
      <img :src="getImage('logo')" alt="" />
      <img src="@/assets/images/bank/logo.png" alt="" />
      <div v-html="html"></div>
    </div>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce';
import { mapState, mapMutations } from 'vuex';
import xss from 'xss';
export default {
  name: 'Home',
  data() {
    return {
      // 当图片加载错误时：
      html: xss(`hello vue<img src="xx" onerror="alert('xss攻击')">`, {
        whiteList: {}
      }),
      count: 1,
      files: []
    };
  },
  computed: {
    ...mapState('app', ['num'])
  },
  watch: {
    files: {
      immediate: true,
      deep: true,
      handler(val) {
        this.files = val;
      }
    }
  },
  created() {
    if (localStorage.getItem('user')) {
      console.log(JSON.parse(localStorage.getItem('user')));
      localStorage.removeItem('user');
    }
    const user = { name: 'Ire Aderinokun', age: 25 };
    localStorage.setItem('user', JSON.stringify(user));
  },
  mounted() {
    // 获取父元素 为拖动目录元素绑定事件
    let dropbox = document.querySelector('.dropbox');
    // 拖动进入 拖动 悬停 阻止事件默认行为
    dropbox.addEventListener('dragenter', this.onDrag, false);
    dropbox.addEventListener('dragover', this.onDrag, false);
    dropbox.addEventListener('drop', this.onDrop, false);
    // this.changeMobsfIframe();
    // window.onresize = function() {
    //   this.changeMobsfIframe();
    // };
    window.onresize = this.throttleFunc(1);
  },
  methods: {
    getImage(bankType = 'logo') {
      const { $banksMap } = this;
      // console.log($banksMap, 6666);
      return require(`@/assets/images/bank/${$banksMap[bankType]}`);
    },
    throttleFunc(num) {
      return throttle(
        1000,
        num => {
          console.log('num:', num);
        }
        // { noLeading: false, noTrailing: false }
      );
    },
    /**
     * iframe-宽高自适应显示
     */
    changeMobsfIframe() {
      const mobsf = document.getElementById('mobsf');
      const deviceWidth = document.body.clientWidth;
      const deviceHeight = document.body.clientHeight;
      console.log('deviceWidth' + deviceWidth);
      console.log('deviceHeight' + deviceHeight);
      mobsf.style.width = Number(deviceWidth) + 'px'; // 数字是页面布局宽度差值
      mobsf.style.height = Number(deviceHeight) - 24 + 'px'; // 数字是页面布局高度差
    },
    ...mapMutations('app', ['setNum']),
    minus() {
      this.count -= 1;
      this.setNum(this.count);
    },
    add() {
      this.count += 1;
      this.setNum(this.count);
    },
    upload() {
      let limitType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      let limitSize = 1 * 1024 * 1024; // 1M
      let fileobj = document.getElementById('fileupload');
      let file = fileobj.files[0];
      console.log(file);
      if (!file) return;
      if (!limitType.includes(file.type)) {
        alert('必须是***文件格式');
        fileobj.value = '';
        return;
      }
      if (file.size > limitSize) {
        alert('文件格式太大');
        fileobj.value = '';
        return;
      }
      let fd = new FormData();
      // 上传文件的时候还要注意请求头
      fd.append('chunk', file); // chunk 为后端输入的 key
      // http(fd).then(res => {});
    },
    uploadFile(file) {
      let item = {
        name: file.name,
        uploadPercentage: 0,
        message: ''
      };
      this.files.push(item);
      let fd = new FormData();
      fd.append('logo', file);

      let xhr = new XMLHttpRequest();
      // 创建一个 post 请求，采用异步
      // pc-server
      xhr.open('POST', 'http://127.0.0.1:3000/upload', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = xhr.responseText;
          console.log(typeof res);
          item.message = res;
        }
      };
      xhr.upload.addEventListener(
        'progress',
        function(e) {
          console.log(e);
          if (e.lengthComputable) {
            item.uploadPercentage = Math.round((e.loaded * 100) / e.total);
          }
        },
        false
      );
      xhr.send(fd);
    },
    onDrag: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      // 在进行拖放操作时，DataTransfer 对象用来保存，通过拖放动作，拖动到浏览器的数据
      let dt = e.dataTransfer;
      for (let i = 0; i !== dt.files.length; i++) {
        // 循环上传多个文件
        this.uploadFile(dt.files[i]);
      }
    }
  }
};
</script>

<style scoped lang="less">
.home {
  a {
    width: 100px;
    height: 100px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("~@/assets/images/S01.jpeg");
    &:hover {
      background-image: url("~@/assets/images/S03.jpeg");
    }
  }

  .ellipsis {
    // width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .multi_line_display {
    // width: 404px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; // 弹性盒模型
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; // 设置弹性盒子的子元素的排列方式
  }
  .multi_line_display_nature {
    width: 147px;
    height: 40px;
    padding-right: 12px; // 留出省略号的位置
    position: relative;
    overflow: hidden;
    line-height: 20px;
  }
  .ellipsis_nature {
    position: absolute;
    right: 2px;
    bottom: 0;
  }
}

p[data-v-2311c06a] {
  color: #f00;
}
.test {
  color: #00f;
}
</style>
