<template>
  <div class="u-f-col">
    <div class="top-filter">
      <el-form :model="filterForm" ref="filterRef" inline label-width="40px" @keyup.enter.native="getDataList()">
        <el-form-item label="标题" prop="title">
          <el-input v-model="filterForm.title" placeholder="文章标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="filterForm.state" placeholder="文章状态" style="width: 120px;">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-select v-model="filterForm.sort" placeholder="" style="width: 120px;">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="createTime">
          <el-date-picker
            v-model="filterForm.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList" :icon="Search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="create" type="primary" :icon="Edit">写文章</el-button>
          <el-button @click="timeVisible = true" type="primary" :icon="EditPen">时间轴</el-button>
          <el-button @click="tagVisible = true" type="primary" :icon="Discount">分类标签</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20" class="data-list">
      <el-col :span="24">
        <el-table
          border
          ref="table"
          :data="dataList"
          highlight-current-row
          v-loading="dataLoading"
          style="width: 100%;">
          <span slot="empty">-暂无数据-</span>
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="category" label="标签" align="center">
            <template #default="scope">
              <el-tag v-for="tag in scope.row.category" :key="tag.name" :type="tag.type" style="margin: 0 3px;">
                {{ tag.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="subtitle" label="简介" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="140">
            <template #default="scope">
              <el-tag v-if="scope.row.state" type="success">正常</el-tag>
              <el-tag v-else type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="clickViews" label="浏览" align="center" width="140"></el-table-column>
          <el-table-column prop="createTime" label="时间" align="center" width="180"></el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right">
            <template #default="scope">
              <el-button @click="toEdit(scope.row.id)" type="primary" link size="small">编辑</el-button>
              <el-button @click="disFun(scope.row.id, scope.row.state)" type="primary" link size="small">
                {{ scope.row.state ? '停用' : '启用' }}
              </el-button>
              <el-button @click="delFun(scope.row.id)" type="primary" link size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" style="margin: 20px;">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 30, 50, 100, 200]"
          :page-size="pageInfo.pageSize"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
    <time-line v-model="timeVisible" />
    <tag-house v-model="tagVisible" />
  </div>
</template>

<script setup>
import {ref, reactive, inject, nextTick, useTemplateRef, onActivated} from 'vue'
import {useRouter} from 'vue-router'
import TimeLine from './components/TimeLine.vue'
import TagHouse from './components/TagHouse.vue'
import { Search, Edit, EditPen, Discount } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = inject('$store')
const request = inject('$request')
const router = useRouter()

const filterForm = reactive({
  title: '',
  state: null,
  sort: 0,
  createTime: ''
})
const statusOptions = ref([{
  value: 1,
  label: '正常'
}, {
  value: 0,
  label: '停用'
}])
const sortOptions = ref([{
  value: 0,
  label: '综合'
}, {
  value: 1,
  label: '时间'
}, {
  value: 2,
  label: '浏览'
}])
const dataList = ref([])
const pageInfo = reactive({
  pageNo: 1,
  pageSize: 10
})
const totalCount = ref(0)
const dataLoading = ref(false)
const tagVisible = ref(false)
const timeVisible = ref(false)

const filterRef = useTemplateRef('filterRef')
// input.value.focus()

onActivated(() => {
  getDataList()
})

const getDataList = async () => {
  dataLoading.value = true
  try {
    const {code, data} = await request({
      url: '/api/blog/adminList',
      method: 'POST',
      data: {
        ...pageInfo,
        ...filterForm
      }
    })
    if (code === 0) {
      dataList.value = data.listData
      totalCount.value = data.totalCount
    }
  } catch (err) {
    console.error(err)
  } finally {
    dataLoading.value = false
  }
}

const reset = async () => {
  filterRef.resetFields()
  await nextTick()
  getDataList()
}

const disFun = (id, state) => {
  ElMessageBox.confirm(
    `确认【${state ? '停用' : '启用'}】此文章吗?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false
    }
  ).then(async () => {
    try {
      const {code} = await request({
        url: '/api/blog/disable',
        method: 'GET',
        data: {
          id: id,
          state: state ? 0 : 1
        }
      })
      if (code === 0) {
        ElMessage({
          message: '操作成功！',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getDataList()
          }
        })
      }
    } catch (err) {
      ElMessage.error(err)
    }
  })
}

const delFun = (id) => {
  ElMessageBox.confirm(
    `确认删除此文章吗?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      showClose: false
    }
  ).then(async () => {
    try {
      const {code} = await request({
        url: '/api/blog/del',
        method: 'GET',
        data: { id: id }
      })
      if (code === 0) {
        ElMessage({
          message: '删除成功！',
          type: 'success',
          duration: 1500,
          onClose: () => {
            getDataList()
          }
        })
      }
    } catch (err) {
      ElMessage.error(err)
    }
  })
}

const create = () => {
  router.push({name: 'creation'})
}

const toEdit = (id) => {
  router.push({name: 'creation', query: {id: id}})
}

const sizeChangeHandle = (val) => {
  pageInfo.pageNo = 1
  pageInfo.pageSize = val
  getDataList()
}

const currentChangeHandle = (val) => {
  pageInfo.pageNo = val
  getDataList()
}
</script>

<style scoped>
.top-filter {
  width: 100%;
  margin-top: 20px;
  padding: 0 30px;
}
.data-list {
  padding: 0 30px;
  margin: 0 !important;
}
</style>
