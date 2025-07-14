<template>
  <div class="about">
    <Header />
    
    <div class="page-content">
      <div class="container">
        <div class="page-header">
          <h1>{{ content.about.title }}</h1>
          <p>{{ content.about.description }}</p>
        </div>
        
        <div class="about-sections">
          <div class="about-section">
            <h2>我们的使命</h2>
            <p>{{ content.about.mission }}</p>
          </div>
          
          <div class="about-section">
            <h2>我们的愿景</h2>
            <p>{{ content.about.vision }}</p>
          </div>
          
          <div class="about-section">
            <h2>我们的价值观</h2>
            <div class="values-grid">
              <div 
                v-for="value in content.about.values" 
                :key="value"
                class="value-item"
              >
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="company-image">
          <img src="../img/DSCF9864.jpg" alt="Company Image" />
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
  name: 'About',
  components: {
    Header,
    Footer
  },
  setup() {
    const contentStore = useContentStore()
    
    return {
      content: contentStore.content
    }
  }
}
</script>

<style scoped>
.about {
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
  max-width: 600px;
  margin: 0 auto;
}

.about-sections {
  display: grid;
  gap: 40px;
  margin-bottom: 60px;
}

.about-section {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.about-section p {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.value-item {
  background: #409eff;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
}

.company-image {
  text-align: center;
}

.company-image img {
  width: 100%;
  max-width: 800px;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }
  
  .about-section {
    padding: 30px 20px;
  }
  
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>