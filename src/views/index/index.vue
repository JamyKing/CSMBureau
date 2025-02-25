<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import {ref, reactive, inject, watch, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'

const request = inject('$request')
const router = useRouter()
const props = defineProps({
  foo: {
    type: String,
    required: true,
    default: ''
  }
})
const emit = defineEmits(['change', 'delete'])

const count = ref(0)
const data = reactive({
  name: 'xxx'
})

watch(count, (newVal, oldVal) => {
  console.log('watch-count', newVal, oldVal)
})

const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('onMounted')
})

const increment = () => {
  count.value++
}
</script>

<style scoped>

</style>
