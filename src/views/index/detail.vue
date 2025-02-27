<template>
  <el-row type="flex" justify="center" style="margin-top: 20px">
    <el-col :xl="{span: 16}" :lg="{span: 18}" :md="{span: 20}" :sm="{span: 22}" :xs="{span: 24}">
      <el-card>
        <el-skeleton :loading="loading" animated :rows="12">
          <template #template>
            <el-skeleton-item variant="h1" style="width: 50%;" />
            <el-skeleton-item variant="text" style="margin: 20px 0;" />
            <el-skeleton-item variant="text" style="min-height: 600px;" />
          </template>
          <template #default>
            <h1 class="title">{{ blogDetail.title }}</h1>
            <div class="time">
              <div>{{ blogDetail.createTime }}</div>
              <div class="item-view">
                <i class="el-icon-view"></i>
                <p class="view-num">{{ blogDetail.clickViews + 1 }}</p>
              </div>
            </div>
            <div v-html="blogDetail.htmlRender" class="markdown-body" style="min-height: 600px;"></div>
          </template>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {ref, inject, onMounted} from 'vue'
import {useRoute} from 'vue-router'

const request = inject('$request')
const route = useRoute()

const id = route.query?.id
const loading = ref(true)
const blogDetail = ref({
  createTime: '',
  clickViews: 0,
  htmlRender: ''
})

onMounted(() => {
  loadDetail()
})

const loadDetail = async () => {
  try {
    loading.value = true
    const {code, data} = await request({
      url: '/api/blog/detail',
      method: 'GET',
      data: { id: id }
    })
    if (code === 0) {
      blogDetail.value = data
    }
    loading.value = false
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}

.time {
  display: flex;
  align-items: center;
  margin: 5px 10px 20px;
}
.item-view {
  display: flex;
  align-items: center;
  margin-left: 16px;
  .view-num {
    color: #666666;
    font-size: 15px;
    margin-left: 2px;
  }
}
</style>
