<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <h1 class="txt">Hello Worldf in App</h1>
    <h1 class="txt2">一点点</h1>
    <!-- 父组件样式入侵 -->
    <HelloWorld></HelloWorld>
  </div>
</template>

<style scoped>
.txt {
  color: red;
}

.txt2 {
  color: pink;
}
</style>
