<template>
  <div>
    <atlas-screen atlasHeight="100%" :sayingShow="false">
      <el-row type="flex" justify="center" class="login-row">
        <el-col class="login-form animated fadeInDownBig" :xl="{span: 8}" :lg="{span: 11}" :md="{span: 14}"
                :sm="{span: 18}" :xs="{span: 22}">
          <el-form :model="loginForm" :rules="rules" ref="loginDom" label-width="100px" @keyup.enter.native="toLogin">
            <el-row>
              <el-col>
                <div class="u-f-auto">
                  <el-avatar class="head" :src="headImg"></el-avatar>
                </div>
              </el-col>
              <el-col :span="20">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="loginForm.username" clearable placeholder="请输入登录用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="密码" prop="password">
                  <el-input v-model="loginForm.password" show-password clearable placeholder="请输入登录密码"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <div class="u-f-auto">
                  <slide-verify
                    ref="verifyRef"
                    slider-text="向右滑动 =>"
                    @success="verifySuccess"
                    @refresh="verifyFail"
                    @fail="verifyFail"
                  />
                </div>
              </el-col>
              <el-col>
                <div class="u-f-auto">
                  <el-button @click="toLogin" class="login-btn" type="success" plain round>登 录</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </atlas-screen>
  </div>
</template>

<script setup>
import {ref, reactive, inject, useTemplateRef} from 'vue'
import AtlasScreen from '@/components/AtlasScreen/index.vue'
import headImg from '@/assets/images/head.jpg'
import SlideVerify from 'vue3-slide-verify'
import "vue3-slide-verify/dist/style.css";
import {useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'

const store = inject('$store')
const request = inject('$request')
const router = useRouter()

const verifyCode = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'}
  ]
})

const loginDom = useTemplateRef('loginDom')
const verifyRef = useTemplateRef('verifyRef')

const verifySuccess = (e) => {
  console.log('verifySuccess', e)
  verifyCode.value = true
}

const verifyFail = () => {
  verifyCode.value = false
}

const toLogin = () => {
  loginDom.value.validate(async (valid) => {
    if (valid && verifyCode.value) {
      try {
        const {code, data} = await request({
          url: '/api/user/login',
          method: 'POST',
          data: loginForm
        })
        if (code === 0) {
          store.login(data.username)
          ElMessage({
            message: '登录成功！',
            type: 'success',
            plain: true,
            duration: '1000',
            onClose: () => {
              router.push({name: 'admin'})
            }
          })
        } else {
          ElMessage({
            message: '用户名或密码错误！',
            type: 'error',
            plain: true,
          })
          verifyCode.value = false
          verifyRef.value.refresh()
        }
      } catch (err) {
        ElMessage({
          message: err,
          type: 'error',
          plain: true,
        })
      }
    } else {
      ElMessage({
        message: '请正确输入登录信息和通过图形验证！',
        type: 'warning',
        plain: true,
      })
    }
  })
}
</script>

<style scoped>
.login-row {
  margin: 0;
  position: absolute;
  top: 24%;
  width: 100%;
}

.login-form {
  background: #474b42;
  border-radius: 10px;
}

.head {
  width: 80px;
  height: 80px;
  margin: 30px 0;
}

.login-btn {
  margin: 30px 0;
}
</style>
