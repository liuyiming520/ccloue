<template>
  <div id="app">
    <router-view />
    <CustomerService />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import CustomerService from '@/components/CustomerService.vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { useSEOStore } from '@/stores/seo'

export default {
  name: 'App',
  components: {
    CustomerService
  },
  setup() {
    const analyticsStore = useAnalyticsStore()
    const seoStore = useSEOStore()

    onMounted(() => {
      // 初始化访客追踪
      analyticsStore.trackVisitor()
      
      // 设置默认SEO
      seoStore.setPageSEO({
        title: '专业的解决方案提供商',
        description: '我们致力于为客户提供优质的产品和服务，拥有专业的团队和创新的技术',
        keywords: ['公司', '服务', '产品', '解决方案', '专业团队']
      })
    })

    return {}
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

body {
  background-color: #f5f5f5;
}
</style>
