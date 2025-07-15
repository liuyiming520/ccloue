<template>
  <div class="products">
    <Header />
    
    <div class="page-content">
      <div class="container">
        <div class="page-header">
          <h1>产品服务</h1>
          <p>我们提供专业的产品和服务解决方案</p>
        </div>
        
        <div v-if="products.length === 0" class="no-products">
          <p>暂无产品信息，请联系管理员添加产品。</p>
        </div>
        
        <div v-else class="products-grid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.image || defaultProductImage" :alt="product.name" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-price" v-if="product.price">
                <span>￥{{ product.price }}</span>
              </div>
              <div class="product-features" v-if="product.features">
                <h4>产品特点:</h4>
                <ul>
                  <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
                </ul>
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
import defaultProductImage from '@/img/DSCF96941.jpg'

export default {
  name: 'Products',
  components: {
    Header,
    Footer
  },
  setup() {
    const contentStore = useContentStore()
    
    return {
      products: contentStore.products,
      defaultProductImage
    }
  }
}
</script>

<style scoped>
.products {
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

.no-products {
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 25px;
}

.product-info h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #333;
}

.product-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.product-price {
  margin-bottom: 15px;
}

.product-price span {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.product-features h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  padding: 5px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.product-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #409eff;
  font-weight: bold;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>