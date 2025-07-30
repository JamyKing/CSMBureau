<template>
  <el-dialog
      title="分类标签"
      v-model="modelVisible"
      width="40%"
      :close-on-click-modal="false"
      :before-close="handleClose">
    <el-card class="box-card">
      <el-tag
        v-for="tag in categoryList"
        :key="tag.id"
        :type="tag.type"
        closable
        effect="plain"
        class="tags animated fadeInDown"
        @close="tagClose(tag)">
        {{ tag.name }}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="inputConfirm"
        @blur="inputConfirm"
      />
      <el-button v-else class="button-new-tag animated fadeInDown" size="small" @click="showInput">+ 新标签</el-button>
    </el-card>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, inject, useTemplateRef, nextTick} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { randomNum } from '@/utils/index.js'

const store = inject('$store')
const request = inject('$request')

const modelVisible = defineModel()

const isUpdate = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const categoryList = ref(store.category)
const options = ref([
  {
    label: 1,
    value: 'primary'
  },
  {
    label: 2,
    value: 'success'
  },
  {
    label: 3,
    value: 'info'
  },
  {
    label: 4,
    value: 'warning'
  },
  {
    label: 5,
    value: 'danger'
  }
])

const saveTagInput = useTemplateRef('saveTagInput')

const showInput = async () => {
  inputVisible.value = true
  await nextTick()
  saveTagInput.value.focus()
}

const inputConfirm = async () => {
  if (inputValue.value) {
    let num = randomNum(1, 5)
    const subForm = {
      id: null,
      name: inputValue.value,
      type: options.value[num - 1].value
    }
    try {
      const {code, data} = await request({
        url: '/api/category/add',
        method: 'POST',
        data: subForm
      })
      if (code === 0) {
        subForm.id = data.id
        categoryList.value.push(subForm)
        isUpdate.value = true
      }
    } catch (err) {
      console.error(err)
    } finally {
      inputVisible.value = false
      inputValue.value = ''
    }
  } else {
    inputVisible.value = false
  }
}

const tagClose = (tag) => {
  ElMessageBox.confirm(
    `确认删除【${tag.name}】标签吗?`,
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
        url: '/api/category/del',
        method: 'GET',
        data: { id: tag.id }
      })
      if (code === 0) {
        isUpdate.value = true
        ElMessage({
          message: '删除成功！',
          type: 'success',
          duration: 1000,
          onClose: () => {
            categoryList.value.splice(categoryList.value.indexOf(tag), 1)
          }
        })
      }
    } catch (err) {
      ElMessage.error(err)
    }
  })
}

const handleClose = () => {
  if (isUpdate.value) {
    store.setCategory(categoryList.value)
  }
  modelVisible.value = false
}
</script>

<style lang="scss" scoped>
.box-card {
  min-height: 360px;

  .tags {
    margin: 5px;
  }

  .button-new-tag {
    margin: 5px 10px;
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin: 5px 10px;
    vertical-align: bottom;
  }
}
</style>
