<!-- setup  vue3 composition 组合式 API -->
<!-- vue2 options 选项式 API -->
<script setup>
// 业务是页面上要动态展示标题，且支持编辑标题
// vue -> focus 标题数据业务，修改数据 余下的DOM更新 vue 替我们做
import { ref, computed } from 'vue'
// 响应式数据
const title = ref("Todos任务清单")
const todos = ref([
  {
    id: 1,
    title: '睡觉',
    done: true
  }, {
    id: 2,
    title: '吃饭',
    done: true
  }
])


function addTodo() {
  // focus 数据业务
  if (!title.value) return
  todos.value.push({
    id: Math.random(),
    title: title.value,
    done: false
  })
  title.value = ''
}
//  依赖于todos 响应式数据的 计算属性
//  形式上是函数(过程)  结果(计算属性)返回
//  同样是响应式的
// computed 缓存 性能优化 只有和他相关的值变化了才会更新
const active = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})
// computed 高级技巧
const allDone = computed({
  get() {
    return todos.value.every(todo => todo.done)
  },
  set(val) {
    todos.value.forEach(todo => todo.done = val)
  }

})
</script>
<template>

  <div>

    <!-- 数据绑定 -->
    <h2>{{ title }}</h2>
    <!-- 双向数据绑定 -->
    <!-- @ -> 缩写 不用addEventlistener -->
    <!-- @event-name:enter 监听键盘输入，当按下enter时 触发addTodo -->
    <input type="test" v-model="title" @keydown.enter="addTodo">
    <ul v-if="todos.length">
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.done">
        <!-- : -> v-bind 缩写 js表达式 
         vue 有一定的学习 api 对用户非常友好 好上手  
        -->
        <span :class="{ done: todo.done }">{{ todo.title }}</span>
      </li>


    </ul>
    <div v-else>
      暂无计划
    </div>
    <div>
      <!-- {{ 数据绑定 表达式结果绑定 }} -->
      <!-- {{todos.filter(todo => !todo.done).length}}/
      {{ todos.length }} -->
      全选<input type="checkbox" v-model="allDone" />
      {{ active }}/{{ todos.length }}
    </div>
  </div>
</template>

<style scoped>
.done {
  color: gray;
  text-decoration: line-through;
}
</style>
