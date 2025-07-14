<template>
  <div class="news">
    <Header />
    
    <div class="page-content">
      <div class="container">
        <div class="page-header">
          <h1>新闻动态</h1>
          <p>了解公司最新动态和行业资讯</p>
        </div>
        
        <div v-if="news.length === 0" class="no-news">
          <p>暂无新闻动态，请联系管理员添加新闻。</p>
        </div>
        
        <div v-else class="news-list">
          <div 
            v-for="item in news" 
            :key="item.id"
            class="news-item"
          >
            <div class="news-date">
              {{ formatDate(item.createTime) }}
            </div>
            <div class="news-content">
              <h3>{{ item.title }}</h3>
              <p class="news-summary">{{ item.summary }}</p>
              <div class="news-full-content" v-if="item.content">
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useContentStore } from '@/stores/content'

export default {
  name: 'News',
  components: {
    Header,
    Footer
  },
  setup() {
    const contentStore = useContentStore()
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return {
      news: contentStore.news,
      formatDate
    }
  }
}
</script>

<style scoped>
.news {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 100px 0 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 42px;
  margin-bottom: 20px;
  color: #333;
}

.page-header p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
}

.no-news {
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-size: 16px;
}

.news-list {
  display: grid;
  gap: 30px;
}

.news-item {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  display: flex;
  gap: 30px;
}

.news-item:hover {
  transform: translateY(-2px);
}

.news-date {
  flex-shrink: 0;
  width: 120px;
  color: #409eff;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  background: #f0f8ff;
  padding: 15px;
  border-radius: 8px;
  height: fit-content;
}

.news-content {
  flex: 1;
}

.news-content h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #333;
  line-height: 1.4;
}

.news-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 16px;
}

.news-full-content {
  color: #555;
  line-height: 1.8;
  font-size: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }
  
  .news-item {
    flex-direction: column;
    padding: 20px;
  }
  
  .news-date {
    width: 100%;
    text-align: left;
  }
}
</style>