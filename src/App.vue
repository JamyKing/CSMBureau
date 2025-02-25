<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" />
  </router-view>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { RouterView } from 'vue-router'
import { useCounterStore } from './stores/counter'

const store = useCounterStore()
const request = inject('$request')

onMounted(() => {
  console.log('app mounted')
  getCategory()
})

const getCategory = async () => {
  try {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      store.setMobile(true)
    }
    const cateRes = await request('/api/category/list', 'GET')
    if (cateRes.code === 0) {
      store.setCategory(cateRes.data)
    }
    // 登录状态校验
    const loginRes = await request('/api/user/loginVerify', 'GET')
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

<style scoped>

</style>
