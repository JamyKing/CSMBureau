import axios from 'axios'
// import { useRouter } from 'vue-router'
// const router = useRouter()

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
// http.interceptors.request.use(conf => {
//     conf.headers['token'] = Vue.cookie.get('token') // 请求头带上token
//     return conf
// }, error => {
//     return Promise.reject(error)
// })

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, 未登录
    // store.logout()
    // router.push({path: '/login'})
  }
  return response
}, error => {
  return Promise.reject(error)
})

const request = (params = {}) => {
  return new Promise((resolve, reject) => {
    http({
      url: params.url,
      method: params.method,
      [params.method === 'GET' ? 'params' : 'data']: params.data
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export default request
