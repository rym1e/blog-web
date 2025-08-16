import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // 后端地址，稍后可写入 yaml
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
