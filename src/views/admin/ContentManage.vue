<template>
  <div class="content-manage">
    <el-tabs v-model="activeTab" type="card">
      <!-- 首页内容 -->
      <el-tab-pane label="首页内容" name="home">
        <el-card>
          <el-form :model="homeData" label-width="120px">
            <el-form-item label="主标题">
              <el-input v-model="homeData.title" placeholder="请输入主标题" />
            </el-form-item>
            
            <el-form-item label="副标题">
              <el-input v-model="homeData.subtitle" placeholder="请输入副标题" />
            </el-form-item>
            
            <el-form-item label="描述">
              <el-input 
                v-model="homeData.description" 
                type="textarea" 
                :rows="3"
                placeholder="请输入描述"
              />
            </el-form-item>
            
            <el-form-item label="特色功能">
              <div class="features-editor">
                <div 
                  v-for="(feature, index) in homeData.features" 
                  :key="index"
                  class="feature-item"
                >
                  <el-input 
                    v-model="feature.title" 
                    placeholder="功能标题"
                    style="margin-bottom: 8px"
                  />
                  <el-input 
                    v-model="feature.description" 
                    placeholder="功能描述"
                    style="margin-bottom: 8px"
                  />
                  <el-button type="danger" size="small" @click="removeFeature(index)">
                    删除
                  </el-button>
                </div>
                <el-button type="primary" @click="addFeature">添加功能</el-button>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveHomeContent">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <!-- 关于我们 -->
      <el-tab-pane label="关于我们" name="about">
        <el-card>
          <el-form :model="aboutData" label-width="120px">
            <el-form-item label="标题">
              <el-input v-model="aboutData.title" placeholder="请输入标题" />
            </el-form-item>
            
            <el-form-item label="描述">
              <el-input 
                v-model="aboutData.description" 
                type="textarea" 
                :rows="4"
                placeholder="请输入公司描述"
              />
            </el-form-item>
            
            <el-form-item label="使命">
              <el-input 
                v-model="aboutData.mission" 
                type="textarea" 
                :rows="3"
                placeholder="请输入公司使命"
              />
            </el-form-item>
            
            <el-form-item label="愿景">
              <el-input 
                v-model="aboutData.vision" 
                type="textarea" 
                :rows="3"
                placeholder="请输入公司愿景"
              />
            </el-form-item>
            
            <el-form-item label="价值观">
              <div class="values-editor">
                <div 
                  v-for="(value, index) in aboutData.values" 
                  :key="index"
                  class="value-item"
                >
                  <el-input 
                    v-model="aboutData.values[index]" 
                    placeholder="价值观"
                  />
                  <el-button type="danger" size="small" @click="removeValue(index)">
                    删除
                  </el-button>
                </div>
                <el-button type="primary" @click="addValue">添加价值观</el-button>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveAboutContent">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <!-- 联系信息 -->
      <el-tab-pane label="联系信息" name="contact">
        <el-card>
          <el-form :model="contactData" label-width="120px">
            <el-form-item label="地址">
              <el-input v-model="contactData.address" placeholder="请输入地址" />
            </el-form-item>
            
            <el-form-item label="电话">
              <el-input v-model="contactData.phone" placeholder="请输入电话" />
            </el-form-item>
            
            <el-form-item label="邮箱">
              <el-input v-model="contactData.email" placeholder="请输入邮箱" />
            </el-form-item>
            
            <el-form-item label="工作时间">
              <el-input v-model="contactData.workTime" placeholder="请输入工作时间" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveContactContent">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useContentStore } from '@/stores/content'

export default {
  name: 'ContentManage',
  setup() {
    const contentStore = useContentStore()
    const activeTab = ref('home')
    
    const homeData = reactive({
      title: '',
      subtitle: '',
      description: '',
      features: []
    })
    
    const aboutData = reactive({
      title: '',
      description: '',
      mission: '',
      vision: '',
      values: []
    })
    
    const contactData = reactive({
      address: '',
      phone: '',
      email: '',
      workTime: ''
    })
    
    onMounted(() => {
      // 加载现有内容
      Object.assign(homeData, contentStore.content.home)
      Object.assign(aboutData, contentStore.content.about)
      Object.assign(contactData, contentStore.content.contact)
    })
    
    const addFeature = () => {
      homeData.features.push({
        title: '',
        description: ''
      })
    }
    
    const removeFeature = (index) => {
      homeData.features.splice(index, 1)
    }
    
    const addValue = () => {
      aboutData.values.push('')
    }
    
    const removeValue = (index) => {
      aboutData.values.splice(index, 1)
    }
    
    const saveHomeContent = () => {
      contentStore.updateContent('home', homeData)
      ElMessage.success('首页内容保存成功！')
    }
    
    const saveAboutContent = () => {
      contentStore.updateContent('about', aboutData)
      ElMessage.success('关于我们内容保存成功！')
    }
    
    const saveContactContent = () => {
      contentStore.updateContent('contact', contactData)
      ElMessage.success('联系信息保存成功！')
    }
    
    return {
      activeTab,
      homeData,
      aboutData,
      contactData,
      addFeature,
      removeFeature,
      addValue,
      removeValue,
      saveHomeContent,
      saveAboutContent,
      saveContactContent
    }
  }
}
</script>

<style scoped>
.content-manage {
  max-width: 800px;
}

.el-card {
  margin-bottom: 20px;
}

.features-editor,
.values-editor {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
}

.feature-item,
.value-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.feature-item {
  flex-direction: column;
  align-items: stretch;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.feature-item .el-button {
  align-self: flex-end;
}

.value-item .el-input {
  flex: 1;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-tabs__content {
  padding-top: 20px;
}
</style>