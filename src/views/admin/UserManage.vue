<template>
  <div class="user-manage">
    <div class="page-header">
      <h2>用户管理</h2>
    </div>
    
    <el-tabs v-model="activeTab" type="card">
      <!-- 管理员列表 -->
      <el-tab-pane label="管理员" name="admin">
        <el-table :data="adminUsers" style="width: 100%">
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLogin" label="最后登录" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" type="primary" @click="editUser(scope.row)">
                编辑
              </el-button>
              <el-button 
                size="small" 
                :type="scope.row.status === 'active' ? 'danger' : 'success'"
                @click="toggleUserStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <!-- 留言管理 -->
      <el-tab-pane label="留言管理" name="messages">
        <el-table :data="messages" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="phone" label="电话" width="140" />
          <el-table-column prop="subject" label="主题" />
          <el-table-column prop="createTime" label="提交时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button size="small" @click="viewMessage(scope.row)">
                查看
              </el-button>
              <el-button size="small" type="danger" @click="deleteMessage(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div v-if="messages.length === 0" class="empty-state">
          <p>暂无留言</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 查看留言对话框 -->
    <el-dialog 
      v-model="messageDialogVisible" 
      title="查看留言"
      width="600px"
    >
      <div v-if="selectedMessage" class="message-detail">
        <div class="message-info">
          <div class="info-item">
            <label>姓名:</label>
            <span>{{ selectedMessage.name }}</span>
          </div>
          <div class="info-item">
            <label>邮箱:</label>
            <span>{{ selectedMessage.email }}</span>
          </div>
          <div class="info-item">
            <label>电话:</label>
            <span>{{ selectedMessage.phone }}</span>
          </div>
          <div class="info-item">
            <label>主题:</label>
            <span>{{ selectedMessage.subject }}</span>
          </div>
          <div class="info-item">
            <label>提交时间:</label>
            <span>{{ formatDate(selectedMessage.createTime) }}</span>
          </div>
        </div>
        
        <div class="message-content">
          <label>留言内容:</label>
          <div class="content-text">{{ selectedMessage.message }}</div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="messageDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 编辑用户对话框 -->
    <el-dialog 
      v-model="userDialogVisible" 
      title="编辑用户"
      width="400px"
    >
      <el-form
        ref="userForm"
        :model="userData"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userData.username" disabled />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="userData.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑" value="editor" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="userData.status" placeholder="请选择状态">
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserManage',
  setup() {
    const activeTab = ref('admin')
    const messages = ref([])
    const messageDialogVisible = ref(false)
    const userDialogVisible = ref(false)
    const selectedMessage = ref(null)
    const userForm = ref(null)
    
    // 模拟管理员数据
    const adminUsers = ref([
      {
        id: 1,
        username: 'admin',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-20 10:30:00'
      }
    ])
    
    const userData = reactive({
      id: null,
      username: '',
      role: '',
      status: ''
    })
    
    const userRules = {
      role: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ]
    }
    
    onMounted(() => {
      // 加载留言数据
      const savedMessages = localStorage.getItem('contact_messages')
      if (savedMessages) {
        messages.value = JSON.parse(savedMessages)
      }
    })
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN')
    }
    
    const viewMessage = (message) => {
      selectedMessage.value = message
      messageDialogVisible.value = true
    }
    
    const deleteMessage = (id) => {
      ElMessageBox.confirm('确定要删除这条留言吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
          messages.value.splice(index, 1)
          localStorage.setItem('contact_messages', JSON.stringify(messages.value))
          ElMessage.success('留言删除成功！')
        }
      }).catch(() => {
        // 用户取消删除
      })
    }
    
    const editUser = (user) => {
      userData.id = user.id
      userData.username = user.username
      userData.role = user.role
      userData.status = user.status
      userDialogVisible.value = true
    }
    
    const toggleUserStatus = (user) => {
      const action = user.status === 'active' ? '禁用' : '启用'
      ElMessageBox.confirm(`确定要${action}用户 ${user.username} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        user.status = user.status === 'active' ? 'inactive' : 'active'
        ElMessage.success(`用户${action}成功！`)
      }).catch(() => {
        // 用户取消操作
      })
    }
    
    const saveUser = () => {
      userForm.value.validate((valid) => {
        if (valid) {
          const userIndex = adminUsers.value.findIndex(u => u.id === userData.id)
          if (userIndex !== -1) {
            adminUsers.value[userIndex] = { ...adminUsers.value[userIndex], ...userData }
            ElMessage.success('用户信息更新成功！')
            userDialogVisible.value = false
          }
        }
      })
    }
    
    return {
      activeTab,
      adminUsers,
      messages,
      messageDialogVisible,
      userDialogVisible,
      selectedMessage,
      userData,
      userRules,
      userForm,
      formatDate,
      viewMessage,
      deleteMessage,
      editUser,
      toggleUserStatus,
      saveUser
    }
  }
}
</script>

<style scoped>
.user-manage {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.message-detail {
  max-height: 400px;
  overflow-y: auto;
}

.message-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.info-item label {
  width: 80px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}

.info-item span {
  color: #666;
}

.message-content {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.message-content label {
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.content-text {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  line-height: 1.6;
  color: #666;
  white-space: pre-wrap;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.el-tabs__content {
  padding-top: 20px;
}

@media (max-width: 768px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item label {
    width: auto;
    margin-bottom: 4px;
  }
}
</style>