<template>
  <div id="app">
    <header>
      <h1>个人博客</h1>
      <nav>
        <router-link to="/">首页</router-link>
        <router-link to="/post">发布文章</router-link>
        <router-link to="/login">登录</router-link>
        <router-link to="/register">注册</router-link>
      </nav>
    </header>

    <!-- 路由出口 -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// App.vue 一般不需要写复杂逻辑，只负责布局
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 20px;
  color: #fff; /* 白色文字，避免黑底看不见 */
  background-color: #2c3e50; /* 深色背景 */
  min-height: 100vh;
}

header {
  margin-bottom: 20px;
}

nav {
  margin: 10px 0;
}

nav a {
  margin-right: 20px;
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #fff;
  background: #42b983;
  padding: 4px 8px;
  border-radius: 5px;
}
</style>
