<template>
  <el-row class="guide" type="flex" justify="space-around">
    <el-col :span="3">
      <div class="u-f">
        <div class="guide-title u-f-auto">棋剑乐府</div>
        <el-switch v-model="switchValue" :active-action-icon="Moon" :inactive-action-icon="Sunny" @change="switchThemes()" />
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
import {ref, inject} from 'vue'
import {useRouter} from 'vue-router'
import {useDark, useToggle} from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'
import headImg from '@/assets/images/head.jpg'

const store = inject('$store')
const router = useRouter()
const isDark = useDark()

const switchValue = ref(false)

const navTo = (url) => {
  router.push({name: url})
}

const switchThemes = () => {
  const toggleDark = useToggle(isDark)
  console.log(toggleDark())
}
</script>

<style lang="scss" scoped>
.guide {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #92977e;
  //opacity: 0.7;

  .guide-title {
    width: 120px;
    height: 60px;
    font-size: 26px;
    color: #000000;
  }

  .guide-item {
    width: 120px;
    height: 60px;
    font-size: 26px;
    font-family: cursive;
    color: #000000;

    &:hover {
      cursor: pointer;
      color: #414141;
    }
  }
}
</style>
