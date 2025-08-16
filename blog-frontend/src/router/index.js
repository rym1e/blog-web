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
