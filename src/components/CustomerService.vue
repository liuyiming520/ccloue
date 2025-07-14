<template>
  <div class="customer-service" v-if="!isAdminPage">
    <!-- 客服按钮 -->
    <div 
      class="service-button" 
      @click="toggleChat"
      :class="{ active: showChat }"
    >
      <el-icon v-if="!showChat"><ChatLineRound /></el-icon>
      <el-icon v-else><Close /></el-icon>
      <span class="service-text">{{ showChat ? '关闭' : '客服' }}</span>
      <div v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</div>
    </div>

    <!-- 聊天窗口 -->
    <transition name="chat-slide">
      <div v-if="showChat" class="chat-window">
        <div class="chat-header">
          <div class="header-info">
            <img src="../assets/logo.png" alt="客服" class="avatar" />
            <div class="info">
              <h4>在线客服</h4>
              <span class="status">{{ isOnline ? '在线' : '离线' }}</span>
            </div>
          </div>
          <el-button text @click="toggleChat">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div class="chat-body" ref="chatBody">
          <div class="welcome-message">
            <div class="message-item service-message">
              <div class="message-content">
                <p>您好！欢迎咨询，我是您的专属客服助手。</p>
                <p>请问有什么可以帮助您的吗？</p>
              </div>
              <div class="message-time">{{ formatTime(new Date()) }}</div>
            </div>
          </div>

          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'user-message': message.type === 'user', 'service-message': message.type === 'service' }"
          >
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.time) }}</div>
          </div>

          <div v-if="isTyping" class="message-item service-message">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div class="chat-footer">
          <div class="quick-actions">
            <el-button 
              size="small" 
              v-for="action in quickActions" 
              :key="action.text"
              @click="sendQuickMessage(action.text)"
            >
              {{ action.text }}
            </el-button>
          </div>
          
          <div class="input-area">
            <el-input
              v-model="inputMessage"
              placeholder="请输入您的问题..."
              @keyup.enter="sendMessage"
              :maxlength="500"
              show-word-limit
            />
            <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()">
              发送
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ChatLineRound, Close } from '@element-plus/icons-vue'

export default {
  name: 'CustomerService',
  components: {
    ChatLineRound,
    Close
  },
  setup() {
    const route = useRoute()
    const showChat = ref(false)
    const inputMessage = ref('')
    const messages = reactive([])
    const unreadCount = ref(0)
    const isTyping = ref(false)
    const isOnline = ref(true)
    const chatBody = ref(null)

    // 检查是否在管理页面
    const isAdminPage = computed(() => route.path.startsWith('/admin'))

    // 快捷回复选项
    const quickActions = [
      { text: '产品咨询' },
      { text: '价格了解' },
      { text: '技术支持' },
      { text: '联系方式' }
    ]

    // 自动回复配置
    const autoReplies = {
      '产品咨询': '我们提供多种专业产品解决方案，您可以访问产品页面了解详情，或告诉我您的具体需求。',
      '价格了解': '关于产品价格，我们会根据您的具体需求提供报价。请留下您的联系方式，我们的销售顾问会尽快与您联系。',
      '技术支持': '我们有专业的技术团队为您提供支持。请描述您遇到的技术问题，我们会尽快为您解决。',
      '联系方式': '您可以通过以下方式联系我们：\n电话：010-12345678\n邮箱：contact@company.com\n地址：北京市朝阳区某某大厦',
      '你好': '您好！很高兴为您服务，请问有什么可以帮助您的吗？',
      '价格': '关于价格详情，请告诉我您感兴趣的具体产品，我会为您提供详细的报价信息。',
      '电话': '我们的客服电话是：010-12345678，工作时间：周一至周五 9:00-18:00',
      '地址': '我们的地址是：北京市朝阳区某某大厦，欢迎您来访！'
    }

    // 切换聊天窗口
    const toggleChat = () => {
      showChat.value = !showChat.value
      if (showChat.value) {
        unreadCount.value = 0
        nextTick(() => {
          scrollToBottom()
        })
      }
    }

    // 发送消息
    const sendMessage = () => {
      if (!inputMessage.value.trim()) return

      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: inputMessage.value,
        time: new Date()
      }

      messages.push(userMessage)
      const messageContent = inputMessage.value
      inputMessage.value = ''

      // 滚动到底部
      nextTick(() => {
        scrollToBottom()
      })

      // 模拟客服回复
      simulateServiceReply(messageContent)
    }

    // 发送快捷消息
    const sendQuickMessage = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    // 模拟客服回复
    const simulateServiceReply = (userMessage) => {
      isTyping.value = true
      
      setTimeout(() => {
        isTyping.value = false
        
        // 智能回复逻辑
        let replyContent = getAutoReply(userMessage)
        
        const serviceMessage = {
          id: Date.now() + 1,
          type: 'service',
          content: replyContent,
          time: new Date()
        }

        messages.push(serviceMessage)
        
        if (!showChat.value) {
          unreadCount.value++
        }

        nextTick(() => {
          scrollToBottom()
        })
      }, 1000 + Math.random() * 2000) // 1-3秒随机延迟
    }

    // 获取自动回复
    const getAutoReply = (message) => {
      const lowerMessage = message.toLowerCase()
      
      // 关键词匹配
      for (const [keyword, reply] of Object.entries(autoReplies)) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return reply
        }
      }

      // 默认回复
      const defaultReplies = [
        '感谢您的咨询！我会尽快为您处理这个问题。',
        '您的问题很重要，让我为您查询相关信息。',
        '好的，我明白您的需求，请稍等片刻。',
        '这是一个很好的问题，我来为您详细解答。'
      ]

      return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
    }

    // 滚动到底部
    const scrollToBottom = () => {
      if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight
      }
    }

    // 格式化时间
    const formatTime = (time) => {
      return time.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 监听聊天窗口状态变化
    watch(showChat, (newVal) => {
      if (newVal) {
        nextTick(() => {
          scrollToBottom()
        })
      }
    })

    // 模拟在线状态
    onMounted(() => {
      setInterval(() => {
        // 模拟偶尔离线
        isOnline.value = Math.random() > 0.1
      }, 30000)
    })

    return {
      isAdminPage,
      showChat,
      inputMessage,
      messages,
      unreadCount,
      isTyping,
      isOnline,
      chatBody,
      quickActions,
      toggleChat,
      sendMessage,
      sendQuickMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.customer-service {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.service-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  color: white;
  position: relative;
}

.service-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(64, 158, 255, 0.4);
}

.service-button.active {
  background: #f56c6c;
}

.service-text {
  font-size: 12px;
  margin-top: 2px;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
}

.info h4 {
  margin: 0;
  font-size: 16px;
}

.status {
  font-size: 12px;
  opacity: 0.9;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f8f9fa;
}

.message-item {
  margin-bottom: 15px;
}

.user-message {
  text-align: right;
}

.user-message .message-content {
  background: #409eff;
  color: white;
  display: inline-block;
  padding: 10px 15px;
  border-radius: 18px 18px 5px 18px;
  max-width: 80%;
  word-wrap: break-word;
}

.service-message .message-content {
  background: white;
  color: #333;
  display: inline-block;
  padding: 10px 15px;
  border-radius: 18px 18px 18px 5px;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  white-space: pre-line;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 10px 15px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.chat-footer {
  background: white;
  border-top: 1px solid #eee;
}

.quick-actions {
  padding: 10px 15px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.input-area {
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.input-area .el-input {
  flex: 1;
}

/* 动画效果 */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s ease;
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .customer-service {
    bottom: 15px;
    right: 15px;
  }

  .service-button {
    width: 50px;
    height: 50px;
  }

  .service-text {
    font-size: 10px;
  }

  .chat-window {
    width: calc(100vw - 30px);
    height: 400px;
    right: -15px;
  }
}
</style>