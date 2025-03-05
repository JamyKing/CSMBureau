<template>
  <header-guide />
    <router-view v-slot="{ Component, route }">
      <keep-alive include="index,about,admin">
        <component :is="Component" :key="route.path" :style="getHeight" />
      </keep-alive>
    </router-view>
  <footer-guide />
</template>

<script setup>
import { inject, onBeforeMount, onMounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import HeaderGuide from '@/components/HeaderGuide/index.vue'
import FooterGuide from '@/components/FooterGuide/index.vue'

const store = inject('$store')
const request = inject('$request')

onBeforeMount(() => {
  console.log('App Mount')
  if (sessionStorage.getItem("CSMBureau")) {
    store.setStore(JSON.parse(sessionStorage.getItem("CSMBureau")))
  } else {
    store.setMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent))
  }
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("CSMBureau", JSON.stringify({
      spring: store.spring,
      category: store.category,
      isMobile: store.isMobile
    }))
  })
  loginVerify()
})

onMounted(() => {
  store.setHeight(document.documentElement['clientHeight'])
  window.onresize = () => {
    if (document.documentElement['clientHeight'] > store.clientHeight) {
      store.setHeight(document.documentElement['clientHeight'])
    }
  }
})

const getHeight = computed(() => `min-height: ${(store.clientHeight - 220)}px;`)

const loginVerify = async () => {
  try {
    // 登录状态校验
    const loginRes = await request({
      url: '/api/user/loginVerify',
      method: 'GET'
    })
    if (loginRes.code === 0 && loginRes.data) {
      store.login('jjk6661')
    } else {
      store.logout()
    }
  } catch (err) {
    console.error(err)
  }
}
</script>
