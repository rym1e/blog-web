好的 ✅ 我已经看过你上传的 **学习计划.md**，你现在正处在第七周的阶段，需要完成一个 **个人博客项目**，核心功能是：

* 用户注册、登录
* 文章发布
* 评论功能

下面我给你写一份 **详细的开发文档**，帮助你用 **Go + Gin + GORM + MySQL** 搭建这个项目。

---

# 📘 个人博客项目开发文档

## 一、项目概述

这是一个基于 **Go语言 Gin 框架** 的个人博客系统，主要目标是熟悉 Web 项目开发流程，掌握 GORM 操作数据库的能力。

功能模块：

1. 用户注册与登录（JWT 认证）
2. 文章发布、浏览
3. 评论功能（用户对文章进行评论）

---

## 二、技术栈

* **后端语言**：Go 1.20+
* **Web 框架**：Gin
* **数据库 ORM**：GORM
* **数据库**：MySQL 8.0+
* **认证方式**：JWT (JSON Web Token)
* **依赖管理**：Go Modules

---

## 三、项目结构设计

```
blog/
├── main.go              // 程序入口
├── config/              // 配置文件（数据库配置等）
│   └── config.go
├── models/              // 数据模型（User, Article, Comment）
│   ├── user.go
│   ├── article.go
│   └── comment.go
├── router/              // 路由定义
│   └── router.go
├── controllers/         // 控制器层（业务逻辑入口）
│   ├── user_controller.go
│   ├── article_controller.go
│   └── comment_controller.go
├── middleware/          // 中间件（JWT认证等）
│   └── auth.go
└── utils/               // 工具类（JWT、加密工具等）
    ├── jwt.go
    └── hash.go
```

---

## 四、数据库设计

### 1. 用户表 `users`

| 字段          | 类型           | 说明       |
| ----------- | ------------ | -------- |
| id          | bigint PK    | 用户ID     |
| username    | varchar(50)  | 用户名      |
| password    | varchar(255) | 密码（加密存储） |
| created\_at | datetime     | 注册时间     |

### 2. 文章表 `articles`

| 字段          | 类型           | 说明   |
| ----------- | ------------ | ---- |
| id          | bigint PK    | 文章ID |
| title       | varchar(255) | 文章标题 |
| content     | text         | 文章内容 |
| user\_id    | bigint FK    | 作者ID |
| created\_at | datetime     | 发布时间 |

### 3. 评论表 `comments`

| 字段          | 类型        | 说明     |
| ----------- | --------- | ------ |
| id          | bigint PK | 评论ID   |
| content     | text      | 评论内容   |
| user\_id    | bigint FK | 评论者ID  |
| article\_id | bigint FK | 所属文章ID |
| created\_at | datetime  | 评论时间   |

---

## 五、功能模块实现

### 1. 用户模块

* **注册**：提交用户名+密码，密码需加密存储（bcrypt）
* **登录**：校验用户名密码，返回 JWT Token
* **鉴权中间件**：在发布文章、发表评论时需要验证 Token

### 2. 文章模块

* **发布文章**：必须登录，填写标题和内容
* **获取文章列表**：展示所有文章（分页）
* **获取文章详情**：根据 ID 获取文章和评论

### 3. 评论模块

* **发表评论**：必须登录，提交评论内容
* **获取评论列表**：根据文章 ID 获取评论

---

## 六、接口设计（RESTful API）

### 用户相关

| 接口 | 方法   | 路径            | 说明         |
| -- | ---- | ------------- | ---------- |
| 注册 | POST | /api/register | 用户注册       |
| 登录 | POST | /api/login    | 用户登录，返回JWT |

### 文章相关

| 接口     | 方法   | 路径                 | 说明     |
| ------ | ---- | ------------------ | ------ |
| 发布文章   | POST | /api/articles      | 创建文章   |
| 获取文章列表 | GET  | /api/articles      | 获取文章列表 |
| 获取文章详情 | GET  | /api/articles/\:id | 获取单篇文章 |

### 评论相关

| 接口     | 方法   | 路径                          | 说明   |
| ------ | ---- | --------------------------- | ---- |
| 发布评论   | POST | /api/articles/\:id/comments | 添加评论 |
| 获取评论列表 | GET  | /api/articles/\:id/comments | 获取评论 |

---

## 七、开发步骤

1. **初始化项目**

   ```bash
   mkdir blog && cd blog
   go mod init blog
   go get -u github.com/gin-gonic/gin
   go get -u gorm.io/gorm
   go get -u gorm.io/driver/mysql
   go get -u github.com/dgrijalva/jwt-go
   go get -u golang.org/x/crypto/bcrypt
   ```

2. **配置数据库连接（config/config.go）**

   ```go
   package config

   import (
       "gorm.io/driver/mysql"
       "gorm.io/gorm"
   )

   var DB *gorm.DB

   func InitDB() {
       dsn := "root:password@tcp(127.0.0.1:3306)/blog?charset=utf8mb4&parseTime=True&loc=Local"
       db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
       if err != nil {
           panic("数据库连接失败: " + err.Error())
       }
       DB = db
   }
   ```

3. **定义数据模型（models/user.go 等）**

4. **编写控制器（controllers）**

   * 用户注册登录逻辑
   * 文章 CRUD
   * 评论 CRUD

5. **JWT 认证中间件（middleware/auth.go）**

6. **路由注册（router/router.go）**

7. **主函数（main.go）**

   ```go
   package main

   import (
       "blog/config"
       "blog/models"
       "blog/router"
   )

   func main() {
       config.InitDB()
       config.DB.AutoMigrate(&models.User{}, &models.Article{}, &models.Comment{})
       r := router.InitRouter()
       r.Run(":8080")
   }
   ```

---

## 八、测试方法

1. 使用 **Postman/Apifox** 测试接口
2. 注册用户 → 登录获取 JWT → 携带 Token 发布文章/评论
3. 验证文章和评论的关联查询是否正常

---

## 九、扩展方向

* 添加用户头像、文章分类、标签
* 支持文章点赞、收藏
* 前端页面展示（Vue / React）
* 部署到服务器（Nginx + Docker）

---

要不要我帮你把 **项目的核心代码骨架**（包括用户/文章/评论的模型、控制器、路由、中间件）也写好，这样你可以直接运行？
明白啦 ✅ 既然你要前后端分离，现在我们先一步步来，从 **Vue 前端项目** 搭建开始。

我会帮你生成一个 **Vue3 + Vite + Pinia + Axios** 的前端骨架，重点是接口联调，UI 简单即可。
（你之前说过已经能初始化 Vue 项目，所以我们直接进入 **项目结构规划 + 文件生成**）

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
好嘞 ✅ 那我帮你把前端页面一步步写出来，每个页面都包含最基本的功能（不复杂化，重点是接口联调，能看到效果）。

---

# 📘 前端页面实现（Vue3）

## 一、登录页 `src/views/Login.vue`

```vue
<template>
  <div class="login">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
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
    alert('登录失败：' + err.response.data.message)
  }
}
</script>
```

---

## 二、注册页 `src/views/Register.vue`

```vue
<template>
  <div class="register">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">注册</button>
    </form>
    <p>已有账号？ <router-link to="/login">去登录</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '../api/user'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    await register({ username: username.value, password: password.value })
    alert('注册成功，请登录！')
    router.push('/login')
  } catch (err) {
    alert('注册失败：' + err.response.data.message)
  }
}
</script>
```

---

## 三、文章列表页 `src/views/ArticleList.vue`

```vue
<template>
  <div class="articles">
    <h2>文章列表</h2>
    <router-link to="/post">✍️ 发布文章</router-link>
    <ul>
      <li v-for="a in articles" :key="a.id">
        <router-link :to="`/article/${a.id}`">{{ a.title }}</router-link>
        <p>作者: {{ a.user_id }} | 时间: {{ a.created_at }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArticles } from '../api/article'

const articles = ref([])

onMounted(async () => {
  const res = await getArticles()
  articles.value = res.data
})
</script>
```

---

## 四、文章详情页 `src/views/ArticleDetail.vue`

```vue
<template>
  <div v-if="article">
    <h2>{{ article.title }}</h2>
    <p>{{ article.content }}</p>
    <hr />
    <h3>评论</h3>
    <CommentList :articleId="article.id" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticle } from '../api/article'
import CommentList from '../components/CommentList.vue'

const route = useRoute()
const article = ref(null)

onMounted(async () => {
  const res = await getArticle(route.params.id)
  article.value = res.data
})
</script>
```

---

## 五、发布文章页 `src/views/PostArticle.vue`

```vue
<template>
  <div class="post-article">
    <h2>发布文章</h2>
    <form @submit.prevent="handlePost">
      <input v-model="title" placeholder="标题" required />
      <textarea v-model="content" placeholder="内容" required></textarea>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createArticle } from '../api/article'
import { useRouter } from 'vue-router'

const title = ref('')
const content = ref('')
const router = useRouter()

const handlePost = async () => {
  try {
    await createArticle({ title: title.value, content: content.value })
    alert('文章发布成功！')
    router.push('/')
  } catch (err) {
    alert('发布失败：' + err.response.data.message)
  }
}
</script>
```

---

## 六、评论组件 `src/components/CommentList.vue`

```vue
<template>
  <div>
    <ul>
      <li v-for="c in comments" :key="c.id">
        {{ c.content }} —— 用户 {{ c.user_id }}
      </li>
    </ul>
    <form @submit.prevent="handleComment">
      <input v-model="newComment" placeholder="写下评论..." required />
      <button type="submit">发表评论</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getComments, createComment } from '../api/comment'

const props = defineProps({
  articleId: Number
})

const comments = ref([])
const newComment = ref('')

const fetchComments = async () => {
  const res = await getComments(props.articleId)
  comments.value = res.data
}

onMounted(fetchComments)

const handleComment = async () => {
  await createComment(props.articleId, { content: newComment.value })
  newComment.value = ''
  fetchComments()
}
</script>
```

---

# 七、运行项目

```bash
npm run dev
```

打开 `http://localhost:5173/` 就能看到前端页面啦 🎉

---

到这里，前端项目的 **登录/注册/文章/评论** 功能就都齐全了。
接下来你可以把数据库的 **host 和 password** 发我，我帮你写 **yaml 配置文件**，把后端和前端对接好。

要不要我先给你生成一个 **docker-compose.yaml**，一键跑 MySQL + 后端服务？
👌 收到数据库连接信息了，那我帮你写一个 **配置文件（yaml + env）**，这样后端可以直接读配置，不需要在代码里硬编码。

---

# 📘 数据库配置

## 一、配置文件 `config.yaml`

放在后端项目的 `config/` 目录下。

```yaml
server:
  port: 8080   # 后端服务端口

database:
  driver: mysql
  host: blog-db-mysql.ns-q3kwx7mj.svc
  port: 3306
  username: root
  password: vnb6xk2w
  name: blog
  charset: utf8mb4
  parseTime: true
  loc: Local
```

---

## 二、Go 代码加载配置（示例）

在 `config/config.go` 中，使用 [viper](https://github.com/spf13/viper) 读取 yaml：

```go
package config

import (
    "fmt"
    "github.com/spf13/viper"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

var DB *gorm.DB

func InitConfig() {
    viper.SetConfigName("config") // 文件名
    viper.SetConfigType("yaml")
    viper.AddConfigPath("./config")
    err := viper.ReadInConfig()
    if err != nil {
        panic("配置文件读取失败: " + err.Error())
    }
}

func InitDB() {
    host := viper.GetString("database.host")
    port := viper.GetString("database.port")
    user := viper.GetString("database.username")
    pass := viper.GetString("database.password")
    name := viper.GetString("database.name")
    charset := viper.GetString("database.charset")
    parseTime := viper.GetString("database.parseTime")
    loc := viper.GetString("database.loc")

    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=%s&loc=%s",
        user, pass, host, port, name, charset, parseTime, loc,
    )

    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("数据库连接失败: " + err.Error())
    }
    DB = db
}
```

然后在 `main.go` 里：

```go
func main() {
    config.InitConfig()
    config.InitDB()
    // 迁移数据库
    config.DB.AutoMigrate(&models.User{}, &models.Article{}, &models.Comment{})
    r := router.InitRouter()
    r.Run(":8080")
}
```

---

## 三、前端对接

前端 `.env.development`：

```env
VITE_API_BASE=http://localhost:8080/api
```

这样 `axios.js` 会自动读取后端接口地址。

---

要不要我再帮你写一个 **docker-compose.yaml**，这样可以一键启动 **MySQL + 后端服务 + 前端**，不需要你手动配置数据库？
👌 明白了，你的意思是：像我写前端那样，给你写一个 **详细的后端开发文档 + 项目结构 + 文件内容**，让你可以直接跟着一步步做出来，而不是一上来就丢给你 Docker。

那我现在给你完整梳理一下后端（Gin + GORM + MySQL + JWT）的结构，就像我之前给前端写的那样。

---

# 📘 后端项目开发文档（Gin + GORM）

## 一、项目结构

```
blog-backend/
├── main.go                # 程序入口
├── go.mod                 # 依赖管理
├── config/                # 配置文件和数据库初始化
│   └── config.go
├── models/                # 数据模型
│   ├── user.go
│   ├── article.go
│   └── comment.go
├── controllers/           # 控制器（处理请求）
│   ├── user_controller.go
│   ├── article_controller.go
│   └── comment_controller.go
├── middleware/            # 中间件（JWT认证）
│   └── auth.go
├── router/                # 路由配置
│   └── router.go
├── utils/                 # 工具（JWT、密码加密）
│   ├── jwt.go
│   └── hash.go
└── config.yaml            # 配置文件（数据库）
```

---

## 二、初始化项目

```bash
mkdir blog-backend && cd blog-backend
go mod init blog-backend
go get -u github.com/gin-gonic/gin
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
go get -u github.com/spf13/viper
go get -u golang.org/x/crypto/bcrypt
go get -u github.com/golang-jwt/jwt/v5
```

---

## 三、配置文件

### `config.yaml`

```yaml
server:
  port: 8080

database:
  driver: mysql
  host: blog-db-mysql.ns-q3kwx7mj.svc
  port: 3306
  username: root
  password: vnb6xk2w
  name: blog
  charset: utf8mb4
  parseTime: true
  loc: Local
```

---

## 四、数据库初始化

### `config/config.go`

```go
package config

import (
	"fmt"
	"github.com/spf13/viper"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./")
	if err := viper.ReadInConfig(); err != nil {
		panic("配置文件读取失败: " + err.Error())
	}
}

func InitDB() {
	host := viper.GetString("database.host")
	port := viper.GetString("database.port")
	user := viper.GetString("database.username")
	pass := viper.GetString("database.password")
	name := viper.GetString("database.name")
	charset := viper.GetString("database.charset")
	parseTime := viper.GetString("database.parseTime")
	loc := viper.GetString("database.loc")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=%s&loc=%s",
		user, pass, host, port, name, charset, parseTime, loc,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("数据库连接失败: " + err.Error())
	}
	DB = db
}
```

---

## 五、数据模型

### `models/user.go`

```go
package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
```

### `models/article.go`

```go
package models

import "time"

type Article struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	UserID    uint      `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}
```

### `models/comment.go`

```go
package models

import "time"

type Comment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	UserID    uint      `json:"user_id"`
	ArticleID uint      `json:"article_id"`
	CreatedAt time.Time `json:"created_at"`
}
```

---

## 六、工具类

### `utils/hash.go`

```go
package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
```

### `utils/jwt.go`

```go
package utils

import (
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var jwtKey = []byte("secret_key") // 你可以放到 config.yaml

type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateToken(userID uint) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func ParseToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}
	return claims, nil
}
```

---

## 七、中间件

### `middleware/auth.go`

```go
package middleware

import (
	"blog-backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "缺少Token"})
			c.Abort()
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ParseToken(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "无效Token"})
			c.Abort()
			return
		}
		c.Set("user_id", claims.UserID)
		c.Next()
	}
}
```

---

## 八、控制器

### 用户控制器 `controllers/user_controller.go`

```go
package controllers

import (
	"blog-backend/config"
	"blog-backend/models"
	"blog-backend/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Register(c *gin.Context) {
	var req models.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	hashedPassword, _ := utils.HashPassword(req.Password)
	user := models.User{Username: req.Username, Password: hashedPassword}
	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "用户已存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "注册成功"})
}

func Login(c *gin.Context) {
	var req models.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	var user models.User
	if err := config.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "用户不存在"})
		return
	}
	if !utils.CheckPassword(user.Password, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "密码错误"})
		return
	}
	token, _ := utils.GenerateToken(user.ID)
	c.JSON(http.StatusOK, gin.H{"token": token})
}
```

### 文章控制器 `controllers/article_controller.go`

```go
package controllers

import (
	"blog-backend/config"
	"blog-backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateArticle(c *gin.Context) {
	var req models.Article
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	userID := c.MustGet("user_id").(uint)
	req.UserID = userID
	config.DB.Create(&req)
	c.JSON(http.StatusOK, req)
}

func GetArticles(c *gin.Context) {
	var articles []models.Article
	config.DB.Find(&articles)
	c.JSON(http.StatusOK, articles)
}

func GetArticle(c *gin.Context) {
	var article models.Article
	id := c.Param("id")
	if err := config.DB.First(&article, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "文章不存在"})
		return
	}
	c.JSON(http.StatusOK, article)
}
```

### 评论控制器 `controllers/comment_controller.go`

```go
package controllers

import (
	"blog-backend/config"
	"blog-backend/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateComment(c *gin.Context) {
	var req models.Comment
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误"})
		return
	}
	articleID := c.Param("id")
	userID := c.MustGet("user_id").(uint)
	req.UserID = userID
	config.DB.Create(&req)
	c.JSON(http.StatusOK, req)
}

func GetComments(c *gin.Context) {
	var comments []models.Comment
	articleID := c.Param("id")
	config.DB.Where("article_id = ?", articleID).Find(&comments)
	c.JSON(http.StatusOK, comments)
}
```

---

## 九、路由

### `router/router.go`

```go
package router

import (
	"blog-backend/controllers"
	"blog-backend/middleware"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)

		api.GET("/articles", controllers.GetArticles)
		api.GET("/articles/:id", controllers.GetArticle)

		api.Use(middleware.AuthMiddleware())
		{
			api.POST("/articles", controllers.CreateArticle)
			api.POST("/articles/:id/comments", controllers.CreateComment)
		}

		api.GET("/articles/:id/comments", controllers.GetComments)
	}

	return r
}
```

---

## 十、主函数

### `main.go`

```go
package main

import (
	"blog-backend/config"
	"blog-backend/models"
	"blog-backend/router"
)

func main() {
	config.InitConfig()
	config.InitDB()

	// 自动迁移表
	config.DB.AutoMigrate(&models.User{}, &models.Article{}, &models.Comment{})

	r := router.InitRouter()
	r.Run(":8080")
}
```

---

# ✅ 运行步骤

1. 确认 MySQL 已经运行，并能用 `mysql -h blog-db-mysql.ns-q3kwx7mj.svc -u root -p` 连接
2. 在后端目录运行：

   ```bash
   go run main.go
   ```
3. 前端用 `npm run dev` 启动，然后就能调用后端接口啦。

---

要不要我帮你整理一个 **接口测试流程（Postman/Apifox 步骤）**，让你能手动测试注册 → 登录 → 发布文章 → 评论的全流程？
