<template>
  <div class="contact">
    <Header />
    
    <div class="page-content">
      <div class="container">
        <div class="page-header">
          <h1>联系我们</h1>
          <p>欢迎与我们取得联系，我们将竭诚为您服务</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <h2>联系信息</h2>
            <div class="info-item">
              <i class="el-icon-location"></i>
              <div>
                <h3>地址</h3>
                <p>{{ content.contact.address }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="el-icon-phone"></i>
              <div>
                <h3>电话</h3>
                <p>{{ content.contact.phone }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="el-icon-message"></i>
              <div>
                <h3>邮箱</h3>
                <p>{{ content.contact.email }}</p>
              </div>
            </div>
            
            <div class="info-item">
              <i class="el-icon-time"></i>
              <div>
                <h3>工作时间</h3>
                <p>{{ content.contact.workTime }}</p>
              </div>
            </div>
          </div>
          
          <div class="contact-form">
            <h2>在线留言</h2>
            <el-form
              ref="messageForm"
              :model="messageData"
              :rules="rules"
              label-width="80px"
            >
              <el-form-item label="姓名" prop="name">
                <el-input v-model="messageData.name" placeholder="请输入您的姓名" />
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="messageData.email" placeholder="请输入您的邮箱" />
              </el-form-item>
              
              <el-form-item label="电话" prop="phone">
                <el-input v-model="messageData.phone" placeholder="请输入您的电话" />
              </el-form-item>
              
              <el-form-item label="主题" prop="subject">
                <el-input v-model="messageData.subject" placeholder="请输入留言主题" />
              </el-form-item>
              
              <el-form-item label="内容" prop="message">
                <el-input
                  v-model="messageData.message"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入留言内容"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="submitMessage">提交留言</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useContentStore } from '@/stores/content'

export default {
  name: 'Contact',
  components: {
    Header,
    Footer
  },
  setup() {
    const contentStore = useContentStore()
    const messageForm = ref(null)
    
    const messageData = reactive({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    
    const rules = {
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入电话', trigger: 'blur' }
      ],
      subject: [
        { required: true, message: '请输入主题', trigger: 'blur' }
      ],
      message: [
        { required: true, message: '请输入留言内容', trigger: 'blur' }
      ]
    }
    
    const submitMessage = () => {
      messageForm.value.validate((valid) => {
        if (valid) {
          // 保存留言到本地存储
          const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
          const newMessage = {
            id: Date.now(),
            ...messageData,
            createTime: new Date().toISOString()
          }
          messages.unshift(newMessage)
          localStorage.setItem('contact_messages', JSON.stringify(messages))
          
          ElMessage.success('留言提交成功！我们会尽快与您联系。')
          resetForm()
        }
      })
    }
    
    const resetForm = () => {
      messageForm.value.resetFields()
    }
    
    return {
      content: contentStore.content,
      messageData,
      rules,
      messageForm,
      submitMessage,
      resetForm
    }
  }
}
</script>

<style scoped>
.contact {
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.contact-info,
.contact-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.contact-info h2,
.contact-form h2 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}

.info-item i {
  font-size: 24px;
  color: #409eff;
  margin-right: 15px;
  margin-top: 5px;
}

.info-item h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.info-item p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .contact-info,
  .contact-form {
    padding: 30px 20px;
  }
}
</style>