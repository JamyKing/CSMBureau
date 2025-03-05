<template>
  <div class="atlas-screen" :style="[{height: props.atlasHeight}]">
    <el-image v-if="store.isMobile" class="bg-img" fit="cover" src="http://www.jianking.vip/resource/RainDate/night.jpg" lazy></el-image>
    <video v-if="!store.isMobile" ref="videoBg" class="bg-video" autoplay muted loop>
      <source class="source-box" src="http://www.jianking.vip/resource/RainDate/night.mp4" type="video/mp4" />
    </video>
    <div v-if="props.sayingShow" class="saying u-f-cer animated flipInX">
      <h1>{{ store.spring.feature }}</h1>
      <h3 v-if="store.spring.extract !== '无'">-《{{ store.spring.extract }}》</h3>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import {ref, reactive, inject, useTemplateRef, onBeforeMount, onActivated} from 'vue'

const store = inject('$store')
const request = inject('$request')
const props = defineProps({
  atlasHeight: {
    type: String,
    default: '560px'
  },
  sayingShow: {
    type: Boolean,
    default: true
  }
})
const videoControl = useTemplateRef('videoBg')

onBeforeMount(() => {
  console.log('onMounted')
  if (store.spring.id === 0) {
    getAim()
  }
})
onActivated(() => {
  console.log('activated')
  if (!store.isMobile && videoControl.paused) {
    videoControl.value.play()
  }
})

const getAim = async () => {
  try {
    const {code, data} = await request({
      url: '/api/common/getAim',
      method: 'GET'
    })
    if (code === 0) {
      store.setSpring(data)
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<style lang="scss" scoped>
.atlas-screen {
  position: relative;
  margin-top: -60px;

  .bg-img {
    width: 100%;
    height: 100%;
  }
  .bg-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    .source-box {
      min-width: 100%;
      min-height: 100%;
      height: auto;
      width: auto;
    }
  }

  .saying {
    width: 100%;
    position: absolute;
    bottom: 30%;

    h1 {
      font-size: 36px;
      max-width: 500px;
      color: white;
      text-align: center;
      font-family: cursive;
      margin-bottom: 30px;
    }

    h3 {
      color: white;
      font-family: cursive;
    }
  }
}
</style>
