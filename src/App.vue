<template>
  <header-guide />
    <router-view v-slot="{ Component, route }">
      <keep-alive include="index,about,admin">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </router-view>
  <footer-guide />
</template>

<script setup>
import { onBeforeMount, inject } from 'vue'
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
