<template>
  <div class="home">
    <Header />
    
    <!-- 轮播图 -->
    <section class="hero">
      <div class="hero-content">
        <h1>{{ content.home.title }}</h1>
        <p>{{ content.home.subtitle }}</p>
        <div class="hero-buttons">
          <router-link to="/products" class="btn btn-primary">查看产品</router-link>
          <router-link to="/about" class="btn btn-secondary">了解更多</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="../img/DSCF9611.jpg" alt="Hero Image" />
      </div>
    </section>
    
    <!-- 特色功能 -->
    <section class="features">
      <div class="container">
        <h2>我们的优势</h2>
        <div class="features-grid">
          <div 
            v-for="feature in content.home.features" 
            :key="feature.title"
            class="feature-item"
          >
            <div class="feature-icon">
              <i class="el-icon-star-on"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 产品展示 -->
    <section class="products-preview" v-if="products.length > 0">
      <div class="container">
        <h2>产品展示</h2>
        <div class="products-grid">
          <div 
            v-for="product in products.slice(0, 4)" 
            :key="product.id"
            class="product-item"
          >
            <img :src="product.image || '../img/DSCF9651.jpg'" :alt="product.name" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
          </div>
        </div>
        <div class="text-center">
          <router-link to="/products" class="btn btn-primary">查看全部产品</router-link>
        </div>
      </div>
    </section>
    
    <!-- 新闻动态 -->
    <section class="news-preview" v-if="news.length > 0">
      <div class="container">
        <h2>新闻动态</h2>
        <div class="news-grid">
          <div 
            v-for="item in news.slice(0, 3)" 
            :key="item.id"
            class="news-item"
          >
            <div class="news-date">{{ formatDate(item.createTime) }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
        </div>
        <div class="text-center">
          <router-link to="/news" class="btn btn-primary">查看全部新闻</router-link>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useContentStore } from '@/stores/content'

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  },
  setup() {
    const contentStore = useContentStore()
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN')
    }
    
    return {
      content: contentStore.content,
      products: contentStore.products,
      news: contentStore.news,
      formatDate
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0 80px;
  display: flex;
  align-items: center;
  min-height: 600px;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-content p {
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #337ecc;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.features {
  padding: 80px 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.features h2,
.products-preview h2,
.news-preview h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 50px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-item {
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 20px;
}

.feature-item h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
}

.feature-item p {
  color: #666;
  line-height: 1.6;
}

.products-preview {
  padding: 80px 0;
  background: #f8f9fa;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.product-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-item:hover {
  transform: translateY(-5px);
}

.product-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-item h3 {
  padding: 20px 20px 10px;
  font-size: 20px;
  color: #333;
}

.product-item p {
  padding: 0 20px 20px;
  color: #666;
  line-height: 1.6;
}

.news-preview {
  padding: 80px 0;
  background: white;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.news-item {
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.news-item:hover {
  transform: translateY(-5px);
}

.news-date {
  color: #409eff;
  font-size: 14px;
  margin-bottom: 10px;
}

.news-item h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.news-item p {
  color: #666;
  line-height: 1.6;
}

.text-center {
  text-align: center;
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .features-grid,
  .products-grid,
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>