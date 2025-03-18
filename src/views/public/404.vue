<template>
  <el-result title="404" sub-title="页面不存在">
    <template #extra>
      <el-button type="primary" @click="backIndex">返回</el-button>
    </template>
  </el-result>
</template>

<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()

const backIndex = () => {
  router.push({name: 'index'})
}
</script>

<style scoped>

</style>
