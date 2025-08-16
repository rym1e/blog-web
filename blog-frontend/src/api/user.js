import request from './axios'

export function register(data) {
  return request.post('/register', data)
}

export function login(data) {
  return request.post('/login', data)
}
