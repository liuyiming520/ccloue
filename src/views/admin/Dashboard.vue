<template>
  <div class="dashboard">
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Box /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ products.length }}</h3>
          <p>产品总数</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ news.length }}</h3>
          <p>新闻总数</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Message /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ messages.length }}</h3>
          <p>留言总数</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><View /></el-icon>
        </div>
        <div class="stat-content">
          <h3>{{ visits }}</h3>
          <p>访问量</p>
        </div>
      </div>
    </div>
    
    <div class="dashboard-content">
      <div class="recent-messages">
        <h3>最新留言</h3>
        <div v-if="messages.length === 0" class="empty-state">
          <p>暂无留言</p>
        </div>
        <div v-else class="messages-list">
          <div 
            v-for="message in messages.slice(0, 5)" 
            :key="message.id"
            class="message-item"
          >
            <div class="message-header">
              <span class="message-name">{{ message.name }}</span>
              <span class="message-time">{{ formatDate(message.createTime) }}</span>
            </div>
            <div class="message-subject">{{ message.subject }}</div>
            <div class="message-content">{{ message.message }}</div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h3>快速操作</h3>
        <div class="actions-grid">
          <router-link to="/admin/content" class="action-item">
            <el-icon><Edit /></el-icon>
            <span>编辑内容</span>
          </router-link>
          
          <router-link to="/admin/products" class="action-item">
            <el-icon><Plus /></el-icon>
            <span>添加产品</span>
          </router-link>
          
          <router-link to="/admin/news" class="action-item">
            <el-icon><Document /></el-icon>
            <span>发布新闻</span>
          </router-link>
          
          <a href="/" target="_blank" class="action-item">
            <el-icon><View /></el-icon>
            <span>查看网站</span>
          </a>
        </div>
      </div>
      
      <div class="storage-status">
        <h3>数据存储状态</h3>
        <div class="status-card">
          <div class="status-item">
            <span class="label">存储类型:</span>
            <el-tag type="success">本地存储</el-tag>
          </div>
          
          <div class="status-item">
            <span class="label">存储状态:</span>
            <el-tag :type="storageStatus.isAvailable ? 'success' : 'danger'">
              {{ storageStatus.isAvailable ? '正常' : '不可用' }}
            </el-tag>
          </div>
          
          <div class="status-actions">
            <el-button 
              size="small" 
              type="danger" 
              @click="handleClearData"
            >
              清空所有数据
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContentStore } from '@/stores/content'
import { 
  Box, 
  Document, 
  Message, 
  View, 
  Edit, 
  Plus 
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: {
    Box,
    Document,
    Message,
    View,
    Edit,
    Plus
  },
  setup() {
    const contentStore = useContentStore()
    const messages = ref([])
    const visits = ref(1234)
    
    onMounted(() => {
      // 加载留言数据
      const savedMessages = localStorage.getItem('contact_messages')
      if (savedMessages) {
        messages.value = JSON.parse(savedMessages)
      }
      
      // 模拟访问量
      const savedVisits = localStorage.getItem('site_visits')
      if (savedVisits) {
        visits.value = parseInt(savedVisits)
      }
    })
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN')
    }

    const handleClearData = async () => {
      try {
        await ElMessageBox.confirm('确定要清空所有数据吗？此操作不可恢复。', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        contentStore.clearAllData()
        messages.value = []
        visits.value = 0
        localStorage.removeItem('site_visits')
        
        ElMessage.success('所有数据已清空')
      } catch (error) {
        // 用户取消操作
      }
    }
    
    return {
      products: contentStore.products,
      news: contentStore.news,
      messages,
      visits,
      storageStatus: contentStore.storageStatus,
      formatDate,
      handleClearData
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.storage-status {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.storage-status h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.status-card {
  display: grid;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.status-item:last-of-type {
  border-bottom: none;
}

.status-item .label {
  font-weight: 500;
  color: #333;
}

.status-actions {
  margin-top: 20px;
  display: grid;
  gap: 10px;
}

.status-actions .el-button {
  width: 100%;
}

.recent-messages,
.quick-actions {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-messages h3,
.quick-actions h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.messages-list {
  display: grid;
  gap: 15px;
}

.message-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.message-item:hover {
  border-color: #409eff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-name {
  font-weight: 500;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-subject {
  font-weight: 500;
  color: #409eff;
  margin-bottom: 5px;
}

.message-content {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.action-item:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
}

.action-item .el-icon {
  font-size: 24px;
}

.action-item span {
  font-size: 14px;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .storage-status {
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>