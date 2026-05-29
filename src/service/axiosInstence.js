// src/services/axiosInstance.js

import axios from 'axios'
import CustomToast from '../components/CustomToast'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authentication-token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => {
    CustomToast({
      title: 'Request Error',
      description: error.message,
      type: 'error',
    })

    return Promise.reject(error)
  }
)

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/
axiosInstance.interceptors.response.use(
  response => response,

  error => {
    const status = error.response?.status

    // Unauthorized
    if (status === 401) {
      localStorage.clear()

      CustomToast({
        title: 'Unauthorized',
        description: 'Session expired. Please login again.',
        type: 'error',
      })

      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }

    // Forbidden
    else if (status === 403) {
      CustomToast({
        title: 'Forbidden',
        description: 'You do not have permission.',
        type: 'warning',
      })
    }

    // Validation Error
    else if (status === 400) {
      CustomToast({
        title: 'Validation Error',
        description:
          error.response?.data?.message || 'Invalid request data.',
        type: 'warning',
      })
    }

    // Server Error
    else if (status >= 500) {
      CustomToast({
        title: 'Server Error',
        description: 'Something went wrong on server.',
        type: 'error',
      })
    }

    // Network Error
    else {
      CustomToast({
        title: 'Network Error',
        description: error.message || 'Please check internet connection.',
        type: 'error',
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance