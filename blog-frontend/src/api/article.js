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
