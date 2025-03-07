<template>
  <el-row class="guide" type="flex" justify="space-around">
    <el-col :span="3">
      <div class="u-f">
        <div class="guide-title u-f-auto">棋剑乐府</div>
        <div class="guide-title u-f-auto">
          <el-switch
            v-model="isDark"
            :active-action-icon="Moon"
            :inactive-action-icon="Sunny"
            @change="switchThemes()"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="6">
      <div class="u-f-jsb">
        <div @click="navTo('index')" class="guide-item u-f-auto">沁园春</div>
        <div @click="navTo('about')" class="guide-item u-f-auto">青玉案</div>
        <div v-if="store.hasLogin" @click="navTo('admin')" class="guide-item u-f-auto">临江仙</div>
        <div v-if="store.hasLogin" class="guide-item u-f-auto">
          <el-avatar :src="headImg"></el-avatar>
        </div>
        <div v-if="!store.hasLogin" @click="navTo('login')" class="guide-item u-f-auto">如梦令</div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {inject, onBeforeMount} from 'vue'
import {useRouter} from 'vue-router'
import {useDark, useToggle} from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'
import headImg from '@/assets/images/head.jpg'

const store = inject('$store')
const router = useRouter()
const isDark = useDark()

onBeforeMount(() => {
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
  setMarkdownTheme(themeMedia.matches)
  themeMedia.addEventListener('change', (e) => {
    console.log(e.matches ? "深色模式" : "浅色模式")
    setMarkdownTheme(e.matches)
  })
})

const navTo = (url) => {
  router.push({name: url})
}

const switchThemes = () => {
  useToggle(isDark)
  setMarkdownTheme(isDark.value)
}

const setMarkdownTheme = (dark) => {
  document.body.setAttribute('data-theme', dark ? 'dark' : 'light')
}
</script>

<style lang="scss" scoped>
.guide {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #474b42;
  opacity: 0.8;

  .guide-title {
    width: 120px;
    height: 60px;
    font-size: 26px;
    color: #FFFFFF;
  }

  .guide-item {
    width: 120px;
    height: 60px;
    font-size: 26px;
    font-family: cursive;
    color: #FFFFFF;

    &:hover {
      cursor: pointer;
      color: #7f7522;
    }
  }
}
</style>
