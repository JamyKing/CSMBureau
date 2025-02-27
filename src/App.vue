<template>
  <el-container>
    <el-header style="padding: 0;">
      <header-guide />
    </el-header>
    <el-main>
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </router-view>
    </el-main>
    <el-footer style="padding: 0;">
      <footer-guide />
    </el-footer>
  </el-container>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { RouterView } from 'vue-router'
import HeaderGuide from '@/components/HeaderGuide/index.vue'
import FooterGuide from '@/components/FooterGuide/index.vue'

const store = inject('$store')
const request = inject('$request')

onMounted(() => {
  console.log('app mounted', store.hasLogin)
  getCategory()
})

const getCategory = async () => {
  try {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      store.setMobile(true)
    }
    const cateRes = await request({
      url: '/api/category/list',
      method: 'GET'
    })
    if (cateRes.code === 0) {
      store.setCategory(cateRes.data)
    }
    // 登录状态校验
    // const loginRes = await request({
    //   url: '/api/user/loginVerify',
    //   method: 'GET'
    // })
    // if (loginRes.code === 0 && loginRes.data) {
    //   store.login('jjk6661')
    // } else {
    //   store.logout()
    // }
  } catch (err) {
    console.error(err)
  }
}


</script>
