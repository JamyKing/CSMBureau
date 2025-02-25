import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const hasLogin = ref(false)
  const userName = ref('')
  const spring = ref({
    id: 0,
    extract: '',
    feature: ''
  })
  const category = ref([])
  const isMobile = ref(false)

  function login(data) {
    hasLogin.value = true
    userName.value = data
  }
  function logout() {
    hasLogin.value = false
    userName.value = ''
  }
  function setCategory(data) {
    category.value = data
  }
  function setSpring(data) {
    spring.value = data
  }
  function setMobile(data) {
    isMobile.value = data
  }

  const getHasLogin = computed(() => hasLogin.value)
  // const doubleCount = computed(() => count.value * 2)

  return {
    hasLogin,
    userName,
    spring,
    category,
    isMobile,
    login,
    logout,
    setCategory,
    setSpring,
    setMobile,
    getHasLogin
  }
})
