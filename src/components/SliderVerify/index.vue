<template>
  <div class="slider-container">
    <div class="slider-track" ref="trackRef" :style="trackStyle">
      <div
        class="slider-button"
        :style="buttonStyle"
        @mousedown="startDrag"
      ></div>
      <div class="slider-tips">{{ tipsText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 验证成功回调
  onSuccess: {
    type: Function,
    default: () => {}
  }
})

// 颜色配置
const colors = {
  initial: '#f0f0f0',      // 初始背景色
  success: '#67c23a',      // 成功颜色
  buttonInitial: '#ffffff', // 按钮初始颜色
  buttonSuccess: '#67c23a'  // 按钮成功颜色
}

const trackRef = ref(null)
const buttonLeft = ref(0)
const isDragging = ref(false)
const isSuccess = ref(false)
const maxLeft = ref(0)
const tipsText = ref('请按住滑块，拖动到最右侧')

// 目标位置（这里设置为轨道宽度 - 按钮宽度）
const targetPosition = ref(0)

// 计算滑动进度比例 (0~1)
const progress = computed(() => {
  return Math.min(buttonLeft.value / targetPosition.value, 1)
})

// 轨道背景色计算
const trackStyle = computed(() => {
  if (isSuccess.value) return { background: colors.success }

  // 颜色过渡计算
  const r = Math.floor(240 * (1 - progress.value) + 103 * progress.value)
  const g = Math.floor(240 * (1 - progress.value) + 194 * progress.value)
  const b = Math.floor(240 * (1 - progress.value) + 58 * progress.value)

  return {
    background: `rgb(${r},${g},${b})`
  }
})

// 按钮样式计算
const buttonStyle = computed(() => {
  const style = {
    left: buttonLeft.value + 'px'
  }

  if (isSuccess.value) {
    style.background = colors.buttonSuccess
  } else {
    // 按钮颜色过渡
    const intensity = 255 * (1 - progress.value)
    style.background = `rgb(${intensity},${intensity},${intensity})`
  }

  return style
})

// 初始化最大可移动距离
const initMaxLeft = () => {
  const trackWidth = trackRef.value.offsetWidth
  const buttonWidth = 40 // 根据实际样式调整
  maxLeft.value = trackWidth - buttonWidth
  targetPosition.value = maxLeft.value - 5 // 允许5像素的误差范围
}

// 开始拖动
const startDrag = (e) => {
  if (isSuccess.value) return
  isDragging.value = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 处理拖动
const handleDrag = (e) => {
  if (!isDragging.value) return

  const trackRect = trackRef.value.getBoundingClientRect()
  let newLeft = e.clientX - trackRect.left - 20 // 20为按钮半径补偿

  // 限制移动范围
  newLeft = Math.max(0, Math.min(newLeft, maxLeft.value))

  buttonLeft.value = newLeft

  // 实时验证
  if (newLeft >= targetPosition.value) {
    handleSuccess()
  }
}

// 处理验证成功
const handleSuccess = () => {
  isSuccess.value = true
  isDragging.value = false
  tipsText.value = '验证成功'
  props.onSuccess()
  removeListeners()
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  removeListeners()

  // 未成功时复位
  if (!isSuccess.value) {
    buttonLeft.value = 0
    tipsText.value = '请按住滑块，拖动到最右侧'
  }
}

// 移除事件监听
const removeListeners = () => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  initMaxLeft()
  window.addEventListener('resize', initMaxLeft)
})

onUnmounted(() => {
  window.removeEventListener('resize', initMaxLeft)
  removeListeners()
})
</script>

<style scoped>
.slider-container {
  padding: 20px;
}

.slider-track {
  position: relative;
  width: 300px;
  height: 40px;
  border-radius: 20px;
  transition: background 0.2s;
}

.slider-button {
  /* 移除原来的背景色设置 */
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  cursor: grab;
  transition: background 0.2s, left 0.1s ease-out;
}

.slider-button.success {
  background: #67c23a;
}

.slider-button:active {
  cursor: grabbing;
}

.slider-tips {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #666;
  user-select: none;
  pointer-events: none;
}
</style>
