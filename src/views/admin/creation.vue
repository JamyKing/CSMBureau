<template>
  <div class="u-f-col">
    <el-form :model="dataForm" ref="formRef" :rules="rules" label-width="60px" style="padding: 0 30px;margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataForm.title" placeholder="文章标题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="state">
            <el-select v-model="dataForm.state" placeholder="文章状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="标签" prop="category">
            <el-select v-model="dataForm.category" multiple filterable placeholder="请选择">
              <el-option
                v-for="item in store.category"
                :key="item.id"
                :label="item.name"
                :value="item.name + '_' + item.type">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="说明" prop="subtitle">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="dataForm.subtitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button @click="submit" type="primary" size="small">提交</el-button>
        </el-col>
      </el-row>
      <el-row>
        <mavon-editor
          ref="editorRef"
          v-model="dataForm.content"
          @change="change"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          style="min-height: 600px; width: 100%;">
        </mavon-editor>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, inject, useTemplateRef, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { ElMessage } from 'element-plus'
import { upload } from '@/utils/upload.js'

const store = inject('$store')
const request = inject('$request')
const route = useRoute()
const router = useRouter()

const id = ref(0)
const dataForm = ref({
  title: '',
  state: 1,
  category: [],
  subtitle: '',
  content: '',
  htmlRender: ''
})
const statusOptions = ref([{
  value: 1,
  label: '正常'
}, {
  value: 0,
  label: '停用'
}])
const rules = ref({
  title: [
    {required: true, message: '请输入文章标题', trigger: 'blur'}
  ],
  subtitle: [
    {required: true, message: '请输入文章说明', trigger: 'blur'}
  ],
  content: [
    {required: true, message: '文章内容不能为空', trigger: 'blur'}
  ]
})

const formRef = useTemplateRef('formRef')
const editorRef = useTemplateRef('editorRef')

onBeforeMount(() => {
  id.value = route.query.id || 0
  if (id.value) {
    editDetail()
  }
})

const editDetail = async () => {
  try {
    const {code, data} = await request({
      url: '/api/blog/edit',
      method: 'GET',
      data: { id }
    })
    if (code === 0) {
      dataForm.value = data
    }
  } catch (err) {
    console.error(err)
  }
}

const change = (value, render) => {
  dataForm.value.htmlRender = render
}

const imgAdd = async (pos, $file) => {
  try {
    const res = await upload($file)
    if (res.code === 0) {
      editorRef.value.$img2Url(pos, res.data.url)
    } else if (res.code === 401) {
      ElMessage({
        message: '未登录！',
        type: 'error',
        duration: '1000',
        onClose: () => {
          router.push({name: 'login'})
        }
      })
    } else {
      ElMessage.error('上传失败！')
    }
  } catch (err) {
    console.error(err)
  }
}

const imgDel = async (filename) => {
  const imgName = filename[0].split('images/')[1]
  try {
    const {code} = await request({
      url: '/api/common/delFile',
      method: 'POST',
      data: { imgName }
    })
    if (code === 0) {
      ElMessage({
        message: '删除成功！',
        type: 'success',
        duration: 1000
      })
    }
  } catch (err) {
    console.error(err)
  }
}

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const {code} = await request({
          url: `/api/blog/${id.value ? 'update' : 'new'}`,
          method: 'POST',
          data: { id, ...dataForm }
        })
        if (code === 0) {
          ElMessage({
            message: `${id ? '更新' : '创建'}成功！`,
            type: 'success',
            duration: '1500',
            onClose: () => {
              router.push({name: 'admin'})
            }
          })
        } else {
          ElMessage.error('出错了！')
        }
      } catch (err) {
        ElMessage.error(err)
      }
    } else {
      ElMessage({
        message: '请正确输入信息！',
        type: 'warning'
      })
    }
  })
}
</script>

<style scoped>

</style>
