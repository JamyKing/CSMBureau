<template>
  <div class="u-f-col">
    <atlas-screen />
    <el-row class="u-f-cer" style="margin-top: 20px">
      <el-col :xl="{span: 12}" :lg="{span: 15}" :md="{span: 17}" :sm="{span: 19}" :xs="{span: 22}" class="line-time">
        <el-skeleton :loading="loading" animated :rows="8">
          <el-timeline>
            <el-timeline-item
                v-for="(item, index) in timeList"
                :key="index"
                type="success"
                :timestamp="item.completeTime"
                placement="top"
                class="animated fadeInUp">
              <el-card class="time-info">
                <div class="info-title u-f">
                  <h3>{{ item.title }}</h3>
                  <el-link v-if="item.github" class="links" :underline="false" :href="item.github">
                    <i class="iconfont icon-github"></i>
                  </el-link>
                  <el-link v-if="item.link" class="links" :underline="false" :href="item.link">
                    <i class="iconfont icon-link"></i>
                  </el-link>
                </div>
                <div class="info-content">{{ item.subtitle }}</div>
                <div v-if="item.images" class="info-images">
                  <el-image
                    v-for="(image, indexImg) in item.images"
                    :key="indexImg"
                    fit="contain"
                    :src="image"
                    @click="preview(item.images)"
                    :preview-src-list="srcList"
                    loading="lazy"
                    class="image">
                  </el-image>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-skeleton>
      </el-col>
      <el-col :xl="{span: 6}" :lg="{span: 9}" :md="{span: 12}" :sm="{span: 15}" :xs="{span: 18}">
        <el-card
          v-show="pageInfo.pageNo < totalPage"
          shadow="hover"
          @click.native="loadMores"
          class="load-more u-f-auto"
          :body-style="{padding: '16px'}">
          加载更多
        </el-card>
      </el-col>
    </el-row>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup>
import {ref, reactive, inject, onBeforeMount} from 'vue'
import AtlasScreen from '@/components/AtlasScreen/index.vue'

const request = inject('$request')

const loading = ref(true)
const timeList = ref([])
const pageInfo = reactive({
  pageNo: 1,
  pageSize: 5
})
const totalPage = ref(1)
const srcList = ref([])

onBeforeMount(() => {
  getTimelineList()
})

const getTimelineList = async () => {
  try {
    const {code, data} = await request({
      url: '/api/timeLine/list',
      method: 'POST',
      data: pageInfo
    })
    if (code === 0) {
      loading.value = false
      totalPage.value = data.totalPage
      for (const item of data.listData) {
        timeList.value.push(item)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
const preview = (images) => {
  srcList.value = images
}
const loadMores = () => {
  pageInfo.pageNo += 1
  getTimelineList()
}
</script>

<style lang="scss" scoped>
.line-time {
  margin: 30px 0;
}

.time-info {
  .info-title {
    .links {
      margin: 0 5px;
      line-height: 25px;
    }
  }

  .info-content {
    margin: 10px 0;
    font-size: 16px;
  }

  .info-images {
    display: flex;
    flex-wrap: wrap;
    .image {
      width: 200px;
      height: 200px;
      margin-right: 20px;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.load-more {
  &:hover {
    cursor: pointer;
  }
}
</style>
