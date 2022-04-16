<template>
  <div class="comp">
    <!-- <MyHeader :title="'Vue组件'"></MyHeader> -->
    <h1>{{ title }}</h1>
    <!-- 自定义组件 -->
    <CourseList :courses="courses"></CourseList>
    <!-- 监听组件事件 -->
    <AddCourse v-model="course" @add-course="addCourse"></AddCourse>
    {{ course }}
    <!-- 插槽实现内容分发 -->
    <!-- :show.sync 等价于 <Message :show="show" @update="$event" > -->
    <Message :show.sync="show">
      <!-- 具名插槽 此时的 {{ title }} 来自当前上下文，即父组件 -->
      <!-- <template v-slot:title>{{ title }}</template> -->
      <!-- 作用域插槽 命名随意例如：slotProps -->
      <!-- 此时 {{ slotProps.title }} 来自作用域 Message 组件 slotProps -->
      <template v-slot:title="slotProps">{{ slotProps.title }}</template>
      <!-- 非具名插槽 默认 -->
      <template>新增课程成功！</template>
      <!-- 上下写法等价 -->
      <!-- <template v-slot:default>新增课程成功！</template> -->
    </Message>
  </div>
</template>
<script>
import MyHeader from '@/components/my-header';
import AddCourse from './components/add-course';
import CourseList from './components/course-list';
import Message from './components/message';

export default {
  name: 'Comp',
  components: {
    MyHeader,
    AddCourse,
    CourseList,
    Message
  },
  data() {
    return {
      title: '开课吧购物车',
      courses: ['web', 'java'],
      course: '',
      show: false // 提示框状态
    };
  },
  created() {},
  methods: {
    // 还原 addCourse
    addCourse() {
      this.courses.push(this.course);
      this.course = '';
      this.show = true;
    }
  }
};
</script>
<style lang="less">
.comp {
  padding: 0;
}
</style>
