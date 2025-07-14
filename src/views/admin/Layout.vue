<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="250px">
        <div class="sidebar">
          <div class="logo">
            <h2>管理后台</h2>
          </div>
          
          <el-menu
            :default-active="$route.path"
            router
            background-color="#2c3e50"
            text-color="#fff"
            active-text-color="#409eff"
          >
            <el-menu-item index="/admin">
              <el-icon><Monitor /></el-icon>
              <span>仪表盘</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/content">
              <el-icon><Edit /></el-icon>
              <span>内容管理</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/products">
              <el-icon><Box /></el-icon>
              <span>产品管理</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/news">
              <el-icon><Document /></el-icon>
              <span>新闻管理</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/analytics">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据统计</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      
      <!-- 主要内容区域 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header class="header">
          <div class="header-left">
            <h3>{{ getPageTitle() }}</h3>
          </div>
          
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><User /></el-icon>
                {{ authStore.user?.username }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- 主要内容 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { 
  Monitor, 
  Edit, 
  Box, 
  Document, 
  User, 
  ArrowDown,
  DataAnalysis
} from '@element-plus/icons-vue'

export default {
  name: 'AdminLayout',
  components: {
    Monitor,
    Edit,
    Box,
    Document,
    User,
    ArrowDown,
    DataAnalysis
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    
    const getPageTitle = () => {
      const titles = {
        '/admin': '仪表盘',
        '/admin/content': '内容管理',
        '/admin/products': '产品管理',
        '/admin/news': '新闻管理',
        '/admin/users': '用户管理',
        '/admin/analytics': '数据统计'
      }
      return titles[route.path] || '管理后台'
    }
    
    const handleCommand = (command) => {
      if (command === 'logout') {
        ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          authStore.logout()
          router.push('/admin/login')
          ElMessage.success('已退出登录')
        }).catch(() => {
          // 用户取消
        })
      } else if (command === 'profile') {
        ElMessage.info('个人资料功能待开发')
      }
    }
    
    return {
      authStore,
      getPageTitle,
      handleCommand
    }
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.sidebar {
  height: 100%;
  background: #2c3e50;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34495e;
}

.logo h2 {
  color: #fff;
  margin: 0;
  font-size: 20px;
}

.el-menu {
  border: none;
  height: calc(100vh - 81px);
  overflow-y: auto;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.el-menu-item.is-active {
  background-color: #409eff !important;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.main-content {
  padding: 20px;
  background: #f5f5f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .el-aside {
    width: 200px !important;
  }
  
  .main-content {
    padding: 15px;
  }
}
</style>