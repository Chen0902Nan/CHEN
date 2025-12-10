<script setup>
import { ref, onMounted } from 'vue' //响应式api
const users = ref([])
onMounted(() => {
  console.log('页面挂载完成');
  fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => users.value = data)

})

</script>

<template>
  <table>
    <thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
      </tr>
    </tbody>
    </thead>
  </table>

</template>

<style scoped></style>
