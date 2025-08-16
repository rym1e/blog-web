
* 我会帮你生成一个 **Vue3 + Vite + Pinia + Axios** 的前端骨架，重点是接口* 联调，UI 简单即可。

---

# 📘 前端项目开发文档（Vue3）

## 一、项目结构

```
blog-frontend/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.js               # 入口文件
│   ├── App.vue
│   ├── api/                  # 接口封装
│   │   ├── axios.js
│   │   ├── user.js
│   │   ├── article.js
│   │   └── comment.js
│   ├── store/                # 状态管理
│   │   └── user.js
│   ├── router/               # 路由配置
│   │   └── index.js
│   ├── views/                # 页面
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── ArticleList.vue
│   │   ├── ArticleDetail.vue
│   │   └── PostArticle.vue
│   ├── components/           # 组件
│   │   └── CommentList.vue
│   └── assets/               # 静态资源
```

---

## 二、依赖安装

```bash
npm init vite@latest blog-frontend --template vue
cd blog-frontend
npm install
npm install vue-router pinia axios
```

---

## 三、接口设计（前端调用后端接口）

### 用户模块

| 功能 | 方法   | 路径            | 前端调用函数               |
| -- | ---- | ------------- | -------------------- |
| 注册 | POST | /api/register | `register(userData)` |
| 登录 | POST | /api/login    | `login(userData)`    |

### 文章模块

| 功能     | 方法   | 路径                 | 前端调用函数                       |
| ------ | ---- | ------------------ | ---------------------------- |
| 发布文章   | POST | /api/articles      | `createArticle(articleData)` |
| 获取文章列表 | GET  | /api/articles      | `getArticles()`              |
| 获取文章详情 | GET  | /api/articles/\:id | `getArticle(id)`             |

### 评论模块

| 功能     | 方法   | 路径                          | 前端调用函数                           |
| ------ | ---- | --------------------------- | -------------------------------- |
| 发表评论   | POST | /api/articles/\:id/comments | `createComment(id, commentData)` |
| 获取评论列表 | GET  | /api/articles/\:id/comments | `getComments(id)`                |

---

## 四、API 封装

### `src/api/axios.js`

```js
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端地址，稍后可写入 yaml
  timeout: 5000
})

// 请求拦截器：添加 token
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default service
```

### `src/api/user.js`

```js
import request from './axios'

export function register(data) {
  return request.post('/register', data)
}

export function login(data) {
  return request.post('/login', data)
}
```

### `src/api/article.js`

```js
import request from './axios'

export function getArticles() {
  return request.get('/articles')
}

export function getArticle(id) {
  return request.get(`/articles/${id}`)
}

export function createArticle(data) {
  return request.post('/articles', data)
}
```

### `src/api/comment.js`

```js
import request from './axios'

export function getComments(articleId) {
  return request.get(`/articles/${articleId}/comments`)
}

export function createComment(articleId, data) {
  return request.post(`/articles/${articleId}/comments`, data)
}
```

---

## 五、前端路由

### `src/router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import PostArticle from '../views/PostArticle.vue'

const routes = [
  { path: '/', component: ArticleList },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/article/:id', component: ArticleDetail },
  { path: '/post', component: PostArticle }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

## 六、状态管理（Pinia）

### `src/store/user.js`

```js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    username: ''
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
```

---

## 七、前端配置文件（yaml）

等你发 **数据库 host 和 password** 时，我们在前端项目根目录加一个 `config.yaml` 或 `.env` 来区分开发环境：

### `.env.development`

```
VITE_API_BASE=http://localhost:8080/api
```

### 修改 `axios.js`

```js
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 5000
})
```

---

现在前端项目的 **基础结构 + 接口封装** 已经搭好了。

要不要我下一步帮你把 **前端页面（Login.vue、Register.vue、ArticleList.vue...）** 也写出来？这样你能直接跑起来看到效果。
