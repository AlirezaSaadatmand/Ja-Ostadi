import axios from "axios"
import config from "../config/config"

const api = axios.create({
  baseURL: config.apiUrl,
})

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("jwt")
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
