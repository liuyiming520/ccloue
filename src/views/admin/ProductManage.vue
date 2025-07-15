<template>
  <div class="product-manage">
    <div class="page-header">
      <h2>产品管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加产品
      </el-button>
    </div>
    
    <el-table :data="products" style="width: 100%">
      <el-table-column label="图片" width="100">
        <template #default="scope">
          <div class="product-image">
            <img 
              v-if="scope.row.image" 
              :src="scope.row.image" 
              :alt="scope.row.name"
              class="table-img"
            />
            <div v-else class="no-image">无图片</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="scope">
          <span v-if="scope.row.price">￥{{ scope.row.price }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="editProduct(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteProduct(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div v-if="products.length === 0" class="empty-state">
      <p>暂无产品，点击上方按钮添加产品</p>
    </div>
    
    <!-- 添加/编辑产品对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑产品' : '添加产品'"
      width="600px"
    >
      <el-form
        ref="productForm"
        :model="productData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productData.name" placeholder="请输入产品名称" />
        </el-form-item>
        
        <el-form-item label="产品描述" prop="description">
          <el-input 
            v-model="productData.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        
        <el-form-item label="产品价格">
          <el-input-number 
            v-model="productData.price" 
            :min="0" 
            :precision="2"
            placeholder="请输入价格"
          />
        </el-form-item>
        
        <el-form-item label="产品图片">
          <div class="image-upload-section">
            <div class="image-preview" v-if="productData.image">
              <img :src="productData.image" alt="产品图片" class="preview-img" />
              <div class="image-actions">
                <el-button size="small" type="danger" @click="removeImage">移除</el-button>
              </div>
            </div>
            <div class="upload-options">
              <el-upload
                ref="uploadRef"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :auto-upload="false"
                accept="image/*"
                class="image-uploader"
              >
                <el-button type="primary" size="small">
                  <el-icon><Upload /></el-icon>
                  选择图片
                </el-button>
              </el-upload>
              <span class="upload-tip">支持jpg、png格式，大小不超过2MB</span>
            </div>
            <div class="predefined-images">
              <p>或选择预设图片：</p>
              <div class="image-grid">
                <div 
                  v-for="img in predefinedImages" 
                  :key="img.name"
                  class="image-item"
                  :class="{ active: productData.image === img.path }"
                  @click="selectPredefinedImage(img.path)"
                >
                  <img :src="img.path" :alt="img.name" />
                  <span>{{ img.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="产品特点">
          <div class="features-editor">
            <div 
              v-for="(feature, index) in productData.features" 
              :key="index"
              class="feature-item"
            >
              <el-input 
                v-model="productData.features[index]" 
                placeholder="产品特点"
              />
              <el-button type="danger" size="small" @click="removeFeature(index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" size="small" @click="addFeature">
              添加特点
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">
            {{ isEdit ? '更新' : '添加' }}
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
import { Plus, Upload } from '@element-plus/icons-vue'

// 导入预设图片
import img1 from '@/img/DSCF9611.jpg'
import img2 from '@/img/DSCF9651.jpg'
import img3 from '@/img/DSCF96941.jpg'
import img4 from '@/img/DSCF9864.jpg'

export default {
  name: 'ProductManage',
  components: {
    Plus,
    Upload
  },
  setup() {
    const contentStore = useContentStore()
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const productForm = ref(null)
    const uploadRef = ref(null)
    
    const productData = reactive({
      id: null,
      name: '',
      description: '',
      price: null,
      image: '',
      features: []
    })
    
    // 预设图片列表
    const predefinedImages = ref([
      { name: '默认图片1', path: img1 },
      { name: '默认图片2', path: img2 },
      { name: '默认图片3', path: img3 },
      { name: '默认图片4', path: img4 }
    ])
    
    const rules = {
      name: [
        { required: true, message: '请输入产品名称', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入产品描述', trigger: 'blur' }
      ]
    }
    
    const resetForm = () => {
      productData.id = null
      productData.name = ''
      productData.description = ''
      productData.price = null
      productData.image = ''
      productData.features = []
      isEdit.value = false
    }
    
    const showAddDialog = () => {
      resetForm()
      dialogVisible.value = true
    }
    
    const editProduct = (product) => {
      isEdit.value = true
      productData.id = product.id
      productData.name = product.name
      productData.description = product.description
      productData.price = product.price
      productData.image = product.image || ''
      productData.features = product.features ? [...product.features] : []
      dialogVisible.value = true
    }
    
    const addFeature = () => {
      productData.features.push('')
    }
    
    const removeFeature = (index) => {
      productData.features.splice(index, 1)
    }
    
    const saveProduct = () => {
      productForm.value.validate((valid) => {
        if (valid) {
          const productInfo = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
            features: productData.features.filter(f => f.trim() !== '')
          }
          
          if (isEdit.value) {
            contentStore.updateProduct(productData.id, productInfo)
            ElMessage.success('产品更新成功！')
          } else {
            contentStore.addProduct(productInfo)
            ElMessage.success('产品添加成功！')
          }
          
          dialogVisible.value = false
          resetForm()
        }
      })
    }
    
    const deleteProduct = (id) => {
      ElMessageBox.confirm('确定要删除这个产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        contentStore.deleteProduct(id)
        ElMessage.success('产品删除成功！')
      }).catch(() => {
        // 用户取消删除
      })
    }
    
    // 图片上传相关方法
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        ElMessage.error('只能上传图片格式的文件!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!')
        return false
      }
      
      // 转换为base64并设置
      const reader = new FileReader()
      reader.onload = (e) => {
        productData.image = e.target.result
        ElMessage.success('图片上传成功！')
      }
      reader.readAsDataURL(file)
      
      return false // 阻止默认上传行为
    }
    
    const handleUploadSuccess = (response, file) => {
      ElMessage.success('图片上传成功！')
    }
    
    const handleUploadError = (error, file) => {
      ElMessage.error('图片上传失败！')
    }
    
    const removeImage = () => {
      productData.image = ''
    }
    
    const selectPredefinedImage = (path) => {
      productData.image = path
    }
    
    return {
      products: contentStore.products,
      dialogVisible,
      isEdit,
      productData,
      rules,
      productForm,
      uploadRef,
      predefinedImages,
      showAddDialog,
      editProduct,
      addFeature,
      removeFeature,
      saveProduct,
      deleteProduct,
      beforeUpload,
      handleUploadSuccess,
      handleUploadError,
      removeImage,
      selectPredefinedImage
    }
  }
}
</script>

<style scoped>
.product-manage {
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

.features-editor {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.feature-item .el-input {
  flex: 1;
}

.dialog-footer {
  text-align: right;
}

.el-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.table-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.no-image {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 4px;
  color: #999;
  font-size: 12px;
  border: 1px solid #eee;
}

/* 图片上传相关样式 */
.image-upload-section {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.image-preview {
  margin-bottom: 20px;
  text-align: center;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-actions {
  margin-top: 10px;
}

.upload-options {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-tip {
  color: #666;
  font-size: 12px;
}

.predefined-images p {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #333;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.image-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
}

.image-item.active {
  border-color: #409eff;
  background-color: #f0f8ff;
}

.image-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 5px;
}

.image-item span {
  font-size: 12px;
  color: #666;
  text-align: center;
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
  
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .upload-options {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>