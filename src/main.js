import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useCounterStore } from './stores/counter'
import request from './utils/request'
import ElementPlus from 'element-plus'
import MakeitCaptcha from 'makeit-captcha'
import 'makeit-captcha/dist/captcha.min.css'
import './assets/css/style.css'
import './assets/css/animate.css'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(MakeitCaptcha)

const store = useCounterStore()

app.provide('$store', store)
app.provide('$request', request)

app.mount('#app')
