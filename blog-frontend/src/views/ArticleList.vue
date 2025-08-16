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
