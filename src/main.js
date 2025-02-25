import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'
import request from './utils/request'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.provide('$request', request)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
