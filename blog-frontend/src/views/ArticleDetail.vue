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
