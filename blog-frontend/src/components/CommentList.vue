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
