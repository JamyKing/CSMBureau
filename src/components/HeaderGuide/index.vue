<template>
  <el-row class="guide" type="flex" justify="space-between">
    <el-col :xl="{span: 2}" :lg="{span: 3}" :md="{span: 4}" :sm="{span: 5}" :xs="{span: 6}">
      <div class="guide-title u-f-auto">棋剑乐府</div>
    </el-col>
    <el-col :xl="{span: 5, pull: 1}" :lg="{span: 9}" :md="{span: 12}" :sm="{span: 15}" :xs="{span: 18}">
      <div class="u-f-jsb">
        <div @click="navTo('index')" class="guide-item u-f-auto">沁园春</div>
        <div @click="navTo('about')" class="guide-item u-f-auto">青玉案</div>
        <div v-if="store.hasLogin" @click="navTo('admin')" class="guide-item u-f-auto">临江仙</div>
        <div v-if="store.hasLogin" class="guide-item u-f-auto">
          <el-avatar src="@/assets/images/head.jpg"></el-avatar>
        </div>
        <div v-if="!store.hasLogin" @click="navTo('login')" class="guide-item u-f-auto">如梦令</div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {inject} from 'vue'
import {useRouter} from 'vue-router'

const store = inject('$store')
const router = useRouter()

const navTo = (url) => {
  router.push({name: url})
}
</script>

<style lang="scss" scoped>
.guide {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #cfcfcf;
  opacity: 0.7;

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
