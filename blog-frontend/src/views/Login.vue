<template>
  <div class="login">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <input v-model="username" placeholder="用户名" required />
      </div>
      <div>
        <input v-model="password" type="password" placeholder="密码" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p>还没有账号？ <router-link to="/register">去注册</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../api/user'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await login({ username: username.value, password: password.value })
    userStore.setToken(res.data.token)
    alert('登录成功！')
    router.push('/')
  } catch (err) {
    alert('登录失败')
  }
}
</script>

<<style scoped>
.login {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #ffffff;
  color: #000000;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.login h2 {
  margin-bottom: 20px;
  text-align: center;
}

.login input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
</style>
