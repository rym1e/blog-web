import request from './axios'

export function getComments(articleId) {
  return request.get(`/articles/${articleId}/comments`)
}

export function createComment(articleId, data) {
  return request.post(`/articles/${articleId}/comments`, data)
}
