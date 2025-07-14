<template>
  <div class="news-manage">
    <div class="page-header">
      <h2>新闻管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        发布新闻
      </el-button>
    </div>
    
    <el-table :data="news" style="width: 100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="summary" label="摘要" show-overflow-tooltip />
      <el-table-column prop="createTime" label="发布时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="editNews(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteNews(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="news.length === 0" class="empty-state">
      <p>暂无新闻，点击上方按钮发布新闻</p>
    </div>
    
    <!-- 添加/编辑新闻对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑新闻' : '发布新闻'"
      width="700px"
    >
      <el-form
        ref="newsForm"
        :model="newsData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="newsData.title" placeholder="请输入新闻标题" />
        </el-form-item>
        
        <el-form-item label="新闻摘要" prop="summary">
          <el-input 
            v-model="newsData.summary" 
            type="textarea" 
            :rows="3"
            placeholder="请输入新闻摘要"
          />
        </el-form-item>
        
        <el-form-item label="新闻内容" prop="content">
          <el-input 
            v-model="newsData.content" 
            type="textarea" 
            :rows="8"
            placeholder="请输入新闻详细内容"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveNews">
            {{ isEdit ? '更新' : '发布' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContentStore } from '@/stores/content'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'NewsManage',
  components: {
    Plus
  },
  setup() {
    const contentStore = useContentStore()
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const newsForm = ref(null)
    
    const newsData = reactive({
      id: null,
      title: '',
      summary: '',
      content: ''
    })
    
    const rules = {
      title: [
        { required: true, message: '请输入新闻标题', trigger: 'blur' }
      ],
      summary: [
        { required: true, message: '请输入新闻摘要', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入新闻内容', trigger: 'blur' }
      ]
    }
    
    const resetForm = () => {
      newsData.id = null
      newsData.title = ''
      newsData.summary = ''
      newsData.content = ''
      isEdit.value = false
    }
    
    const showAddDialog = () => {
      resetForm()
      dialogVisible.value = true
    }
    
    const editNews = (news) => {
      isEdit.value = true
      newsData.id = news.id
      newsData.title = news.title
      newsData.summary = news.summary
      newsData.content = news.content
      dialogVisible.value = true
    }
    
    const saveNews = () => {
      newsForm.value.validate((valid) => {
        if (valid) {
          const newsInfo = {
            title: newsData.title,
            summary: newsData.summary,
            content: newsData.content
          }
          
          if (isEdit.value) {
            contentStore.updateNews(newsData.id, newsInfo)
            ElMessage.success('新闻更新成功！')
          } else {
            contentStore.addNews(newsInfo)
            ElMessage.success('新闻发布成功！')
          }
          
          dialogVisible.value = false
          resetForm()
        }
      })
    }
    
    const deleteNews = (id) => {
      ElMessageBox.confirm('确定要删除这条新闻吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contentStore.deleteNews(id)
        ElMessage.success('新闻删除成功！')
      }).catch(() => {
        // 用户取消删除
      })
    }
    
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN')
    }
    
    return {
      news: contentStore.news,
      dialogVisible,
      isEdit,
      newsData,
      rules,
      newsForm,
      showAddDialog,
      editNews,
      saveNews,
      deleteNews,
      formatDate
    }
  }
}
</script>

<style scoped>
.news-manage {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.dialog-footer {
  text-align: right;
}

.el-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .page-header h2 {
    text-align: center;
  }
}
</style>