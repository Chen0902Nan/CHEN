<script setup>
</script>

<template>
  <header>
    <nav>
      <ul>
        <!-- app.use(router)之后 vue-router 带给我们的全局组件 -->
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

<style scoped></style>
