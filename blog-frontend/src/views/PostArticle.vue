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
