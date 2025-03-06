<template>
  <div class="">
    <atlas-screen />
    <div class="index-content">
      <div class="u-f-col">
        <div class="data-list">
          <el-card v-for="(item, index) in dataList" :key="index" shadow="hover" @click="getDetail(item)"
               class="list-item animated fadeIn">
            <h2 class="title">{{ item.title }}</h2>
            <div v-if="item.category">
              <el-tag v-for="tag in item.category" :key="tag.name" :type="tag.type" style="margin: 0 3px;">
                {{ tag.name }}
              </el-tag>
            </div>
            <h3 class="sub-title">{{ item.subtitle }}</h3>
            <div class="list-bottom">
              <p class="meta">{{ item.createTime }}</p>
              <div v-if="item.clickViews" class="item-view">
                <i class="el-icon-view"></i>
                <p class="view-num">{{ item.clickViews }}</p>
              </div>
            </div>
            <div class="hr"></div>
          </el-card>
        </div>
        <div v-show="dataList.length > 0" class="u-f-jsb" style="padding: 0 10px;">
          <el-button @click="prePage" :disabled="pageInfo.pageNo === 1" type="primary" plain :icon="ArrowLeft">上一页</el-button>
          <el-button @click="nextPage" :disabled="pageInfo.pageNo === totalPage" type="primary" plain>
            下一页<el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="index-right u-f-col">
        <el-image class="head-img" :src="headImg"></el-image>
        <div class="tag-group">
          <el-tag
            v-for="tag in store.category"
            :key="tag.id"
            :type="tag.type"
            :effect="tag.name === pageInfo.categoryName ? 'dark' : 'plain'"
            @click="tagSelected(tag.name)"
            class="tags animated fadeInDown">
            {{ tag.name }}
          </el-tag>
          <!--全部标签-->
          <el-tag @click="tagSelected('')" type="info" effect="plain" class="tags animated fadeInDown">ALL</el-tag>
        </div>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup>
import {ref, reactive, inject, onBeforeMount} from 'vue'
import AtlasScreen from '@/components/AtlasScreen/index.vue'
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import headImg from '@/assets/images/head.jpg'

const store = inject('$store')
const request = inject('$request')
const router = useRouter()

const dataList = ref([])
const pageInfo = reactive({
  pageNo: 1,
  pageSize: 5,
  categoryName: ''
})
const totalPage = ref(1)

onBeforeMount(() => {
  console.log('Index Mounted')
  getDataList()
  if (store.category.length === 0) {
    getCategoryList()
  }
})

const getDataList = async () => {
  try {
    const {code, data} = await request({
      url: '/api/blog/indexList',
      method: 'POST',
      data: pageInfo
    })
    if (code === 0) {
      totalPage.value = data.totalPage
      dataList.value = data.listData
      if (totalPage === 0) {
        ElMessage({
          message: '没有找到合适的内容，请更换条件后再次搜索~',
          type: 'warning',
          plain: true,
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const getCategoryList = async () => {
  try {
    const cateRes = await request({
      url: '/api/category/list',
      method: 'GET'
    })
    if (cateRes.code === 0) {
      store.setCategory(cateRes.data)
    }
  } catch (err) {
    console.error(err)
  }
}

const tagSelected = (name) => {
  pageInfo.categoryName = name
  pageInfo.pageNo = 1
  getDataList()
}

const getDetail = (item) => {
  router.push({name: 'detail', query: {id: item.id}})
  return item.clickViews += 1
}

const prePage = () => {
  pageInfo.pageNo -= 1
  getDataList()
}

const nextPage = () => {
  pageInfo.pageNo += 1
  getDataList()
}
</script>

<style lang="scss" scoped>
.index-content {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
.index-right {
  width: 320px;
  .head-img {
    width: 260px;
    height: 260px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 10px 15px;
  }

  .tag-group {
    padding: 0 10px;

    .tags {
      margin: 5px;

      &:hover {
        cursor: pointer;
        color: orangered;
      }
    }
  }
}

.data-group {
  //background: white;
  padding: 10px;
}

.data-list {
  width: 800px;
  min-height: 600px;

  .list-item {
    margin-bottom: 20px;

    &:hover {
      cursor: pointer;
    }

    .title {
      font-size: 26px;
      line-height: 1.3;
      margin: 10px 0;
    }

    .sub-title {
      font-size: 17px;
      line-height: 1.5;
      font-weight: 300;
      margin: 10px 0;
      max-height: 100px;
      overflow: hidden;
    }

    .list-bottom {
      display: flex;
      align-items: center;
      .meta {
        font-family: Lora, 'Times New Roman', serif;
        font-size: 18px;
        font-style: italic;
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
    }

    .hr {
      height: 0;
      margin: 20px 0;
      border: 0;
    }
  }
}
</style>
